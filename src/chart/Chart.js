import _ from 'lodash'
import ECharts from 'echarts';

class Chart {
  constructor(el, xml) {
    this.el       = el;
    this.chartXml = getByName(xml, 'c:chart');
    try {
      this.chartOption = _.defaultsDeep({}, this.getSeries(), this.getLegend(), this.getAxis(), this.getTitle(), this.getLayout());
    } catch (e) {
      console.error(e);
    }

    const chart = ECharts.init(el);

    chart.setOption(this.chartOption);
  }

  getTitle() {
    return {
      title: {
        text: _.get(getByPath(this.chartXml, 'c:title/c:tx'), 'textContent'),
      },
    };
  }

  getAxis() {

    const catLines = getByPath(this.chartXml, 'c:plotArea/c:catAx/c:majorGridlines');
    const xAxis    = {
      splitLine: {
        show: false,
      },
    };

    if (catLines) {
      if (!getByName(catLines, 'a:noFill')) {
        xAxis.splitLine.show = true;
      }
    }

    const valLines = getByPath(this.chartXml, 'c:plotArea/c:valAx/c:majorGridlines');
    const yAxis    = {
      splitLine: {
        show: false,
      },
    };

    if (valLines) {
      if (!getByName(valLines, 'a:noFill')) {
        yAxis.splitLine.show = true;
      }
    }

    return {
      xAxis,
      yAxis,
    };
  }


  getLegend() {

    const layout = getByPath(this.chartXml, 'c:legend/c:layout/c:manualLayout');
    const legend = {};
    if (layout) {
      _.each(layout.children, child => {
        if (child.tagName == 'c:x') {
          legend.left = (+child.getAttribute('val')) * 100 + '%';
        }
        if (child.tagName == 'c:y') {
          legend.top = (+child.getAttribute('val')) * 100 + '%';
        }
//        if (child.tagName == 'c:w') {
//          grid.width = (+child.getAttribute('val')) * 100 + '%';
//        }
//        if (child.tagName == 'c:h') {
//          grid.height = (+child.getAttribute('val')) * 100 + '%';
//        }
      });
    }

    return {
      legend,
    };
  }

  getLayout() {

    const layout = getByPath(this.chartXml, 'c:plotArea/c:layout/c:manualLayout');
    const grid   = {};
    if (layout) {
      _.each(layout.children, child => {
        if (child.tagName == 'c:x') {
          grid.left = (+child.getAttribute('val')) * 100 + '%';
        }
        if (child.tagName == 'c:y') {
          grid.top = (+child.getAttribute('val')) * 100 + '%';
        }
        if (child.tagName == 'c:w') {
          grid.width = (+child.getAttribute('val')) * 100 + '%';
        }
        if (child.tagName == 'c:h') {
          grid.height = (+child.getAttribute('val')) * 100 + '%';
        }
      });
    }

    return {
      grid,
    };
  }

  getSeries() {
    const nodes = _.filter(getByName(this.chartXml, 'c:plotArea').children, node => {
      return node.tagName.match(/^c:([a-zA-Z3]+)Chart$/);
    });

    const xAxis = {
      type: 'category',
      data: [],
    };

    const yAxis  = {
      type: 'value',
    };
    const legend = {
      data: [],
    };

    let series = [];

    _.each(nodes, node => {
      const type = node.tagName.match(/^c:([a-zA-Z3]+)Chart$/)[1].replace('3D', '');

      const lines = parseLineBar(type, node);

      xAxis.data  = _.union(xAxis.data, lines.categoryData);
      legend.data = _.union(legend.data, lines.legendData);
      series      = series.concat(lines.series);
    });

    return {
      xAxis: xAxis,
      yAxis: yAxis,
      series,
      legend,
    };

  }

  static parse(el, xml) {

    new Chart(el, xml);

  }

}

function parseLineBar(type, node) {
  let categoryData = null;

  let legendData = [];

  const series = _.map(getByNames(node, 'c:ser'), ser => {
    const name = getByPath(ser, 'c:tx/c:strRef/c:strCache').textContent;

    let cNames = [];

    let cache = getByPath(ser, 'c:cat/c:strRef/c:strCache');

    if (cache == null) {
      cache = getByPath(ser, 'c:cat/c:multiLvlStrRef/c:multiLvlStrCache');
      _.map(getByNames(cache, 'c:lvl'), lvl => {
        _.each(getByNames(lvl, 'c:pt'), pt => {
          const index = pt.getAttribute('idx');
          if (cNames[index]) {
            cNames[index] = pt.textContent + '-' + cNames[index];
          } else {
            cNames[index] = pt.textContent;
          }
        });
      });
    } else {
      cNames = _.map(getByNames(cache, 'c:pt'), pt => {
        return pt.textContent;
      });
    }

    const cValues = _.map(getByNames(getByPath(ser, 'c:val/c:numRef/c:numCache'), 'c:pt'), pt => {
      return +pt.textContent;
    });

    if (categoryData == null) {
      categoryData = cNames;
    }

    legendData.push(name);

    return {
      type,
      name: name,
      data: cValues,
    };

//    return {
//      name,
//      cNames,
//      cValues,
//    };
  });

//  const series = _.map(sers[0].cNames, (cName, index) => {
//    legendData.push(cName);
//    return {
//      type,
//      name: cName,
//      data: _.map(sers, ser => {
//        return ser.cValues[index];
//      }),
//    };
//  });

  return {
    series,
    legendData,
    categoryData,
  };
}

function getByPath(xml, paths) {
  function fn(xml, tagName) {
    return _.find(xml.children, { tagName });
  }

  for(const name of paths.split('/')) {
    if (xml == null) {
      return;
    }
    xml = fn(xml, name);
  }
  return xml;
}

function getByName(xml, name) {
  return _.first(getByNames(xml, name));
}

function getByNames(xml, name) {
  return xml.getElementsByTagName(name);
}

export default Chart;
