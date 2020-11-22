class RoseData {
    static parseLevel(levelData) {
        let data = {};
        let level = 1;
        for (let i = 0; i < 24; i++) {
            if (i === 8 || level === 16) level++;
            data[i + 1] = levelData[
                    `${RoseData.DATA_PREFIX}-${level}/${Rose.DIRECTIONS[i % 8]}`
                ];
        }
        return data;
    }

    static parse(data) {
        return d3.rollup(
            data,
            v => RoseData.parseLevel(v[0]),
            d => d.date
        )
    }
}
RoseData.DATA_PREFIX = 'data/level';

class Rose {
    constructor(data, map) {
        this.data = RoseData.parse(data);
        this.map = map;
        this.menu = new RoseMenu(this);
    }

    levelArcs(level) {
        const offset = level - 1
        return d3.arc()
            .innerRadius(offset * Rose.RADIUS + offset)
            .outerRadius(level * Rose.RADIUS + offset)
            .startAngle(d => { return d.startAngle - Rose.PETAL_OFFSET })
            .endAngle(d => { return d.endAngle - Rose.PETAL_OFFSET });
    }

    addElevationLevel(ids, level) {
        this.svg.append("g")
            .selectAll("path")
            .data(d3.pie().value(() => Rose.PETAL_ARC)(ids))
            .enter()
            .append("path")
            .attr('fill', 'none')
            .classed('petal', true)
            .attr("d", this.levelArcs(level))
            .on('mouseover', function () {
                d3.select(this).classed('hover', true).raise();
            })
            .on('mouseout', function () {
                d3.select(this).classed('hover', false);
            })
            .on('click', (e, d) => {
                e.stopPropagation();
                this.map.selection = [d.data];
                this.map.redraw();
                this.menu.clear();
            });
    }

    draw() {
        const div = d3.select("#rose-view");

        this.svg = div.append("svg")
            .attr("id", "rose-diagram")
            .attr("width", "100%")
            .attr("height", "100%")
            .on('click',  (e, d) => {
                e.stopPropagation();
                this.map.selection = undefined;
                this.menu.clear();
                this.map.redraw();
            });

        // From inside out
        this.addElevationLevel(UACMapper.HIGH_ELEVATION_IDS.all, 1)
        this.addElevationLevel(UACMapper.MID_ELEVATION_IDS.all, 2)
        this.addElevationLevel(UACMapper.LOW_ELEVATION_IDS.all, 3)

        let arc_length = 180;

        let x_text_location = [0, 1 / Math.SQRT2, 1, 1 / Math.SQRT2, 0, -(1 / Math.SQRT2), -1, -(1 / Math.SQRT2)]
        let y_text_location = [-1, -(1 / Math.SQRT2), 0, 1 / Math.SQRT2, 1, 1 / Math.SQRT2, 0, -(1 / Math.SQRT2)]

        this.svg.append("g").selectAll("path")
            .data(Rose.DIRECTIONS)
            .enter()
            .append("text")
            .attr("x", function (d, i) {
                return arc_length * x_text_location[i];
            })
            .attr("y", function (d, i) {
                return arc_length * y_text_location[i];
            })
            .text((d) => d);

        this.menu.addOptions();
    }

    showForecast(date = null) {
        // TODO - Use given date
        const forecast = this.data.get('01-01-2020');

        this.map.forecast = forecast;
        this.svg
            .selectAll('.petal')
            .attr("fill", (d) => {
                return AvalancheDangerColor.colorForId(forecast[d.data])
            });
    }
}
Rose.DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
Rose.RADIUS = 50;
Rose.PETAL_ARC = Math.PI / 4;
Rose.PETAL_OFFSET = Math.PI / 8;