import _ from 'lodash';
import Mock from 'mockjs';

const companyList = [
  '公司1',
  '公司2',
  '公司3',
  '公司4',
  '公司5',
  '公司6',
  '公司7',
  '公司8',
  '公司9',
  '公司10',
];
const departmentList = [
  '检验科',
  '放射科',
  '超声科',
  'ICU',
  '血透室',
  '营养室',
  '骨一科',
  '外一科',
  '手术室',
];

const pureMockData = Mock.mock({
  'equipments|600-1000': [
    {
      'id|+1': 1,
      'company|1': companyList,
      'department|1': departmentList,
      'price|1000-500000': 0,
      'is_operating|2-95': false,
      'operating_rates|0.4': 0,
      'using_rates|0.4': 0,
      'operating_duration|0-10000000': 0,
    },
  ],
});

const equipments_count = _.size(pureMockData.equipments);
const equipments_all_prices = _.sumBy(pureMockData.equipments, 'price');
const equipments_mean_prices = _.meanBy(pureMockData.equipments, 'price');
const equipment_is_operating_count = _.countBy(
  pureMockData.equipments,
  'is_operating',
).true;

export const mockData = {
  information: {
    equipments_count,
    equipments_all_prices,
    equipments_mean_prices,
    equipment_is_operating_count,
    equipment_is_operating_rate: _.round(
      _.divide(equipment_is_operating_count, equipments_count),
      5,
    ),
  },
  ...pureMockData,
};
