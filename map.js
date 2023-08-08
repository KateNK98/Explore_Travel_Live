(function (d3, topojson) {
    'use strict';

    const svg = d3.select('svg');
    const projection = d3.geoOrthographic()
                        .scale(250)
                        .center([0, 0])
                        .rotate([0, -30])
                        .translate([960 / 2, 500 / 2]);
    const initialScale = projection.scale();
    let path = d3.geoPath().projection(projection);
    const sensitivity = 75;

    let globe = svg.append("circle")
                    .attr("fill", "#EEE")
                    .attr("stroke", "#000")
                    .attr("stroke-width", "0.2")
                    .attr("cx", 960/2)
                    .attr("cy", 500/2)
                    .attr("r", initialScale);

        Promise.all([
            d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
                    d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
        ]).then(([tsvData, topoJSONdata]) => {
            svg.call(d3.drag().on('drag', () => {
                const rotate = projection.rotate();
                const k = sensitivity / projection.scale();
                projection.rotate([
                    rotate[0] + d3.event.dx * k,
                    rotate[1] - d3.event.dy * k
                ]);
                path = d3.geoPath().projection(projection);
                svg.selectAll("path").attr("d", path);
            }))
                .call(d3.zoom().on('zoom', () => {										
                    if(d3.event.transform.k > 0.3) {
                        projection.scale(initialScale * d3.event.transform.k);
                        path = d3.geoPath().projection(projection);
                        svg.selectAll("path").attr("d", path);
                        globe.attr("r", projection.scale());
                    }
                    else {
                        d3.event.transform.k = 0.3;
                    };
                }));

            const countryName = {};
            tsvData.forEach(d => {
                countryName[d.iso_n3] = d.name;
            });

            const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries)

            //да се върти самостоятелно
			d3.timer(function(elapsed) {
			const rotate = projection.rotate();
			const k = sensitivity / projection.scale();
			projection.rotate([
				rotate[0] - 1 * k,
				rotate[1]
			]);
			path = d3.geoPath().projection(projection);
			svg.selectAll("path").attr("d", path);
			},200);

            svg.selectAll('path').data(countries.features)
                        .enter().append('path')
                        .attr('class', 'country')
                        .attr('d', path)
                        .attr('fill', '#362c26')
                        .attr('stroke', '#957a6a')
                        .append('title')
                        .text(d => countryName[d.id]);
                        

            let country = document.querySelectorAll('.country');
            country.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.target.style.fill = '#660d33';
                    e.target.style.stroke = 'black';
                });                       
            });
        });
}(d3, topojson));