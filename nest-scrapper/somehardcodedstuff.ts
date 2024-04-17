// inflacja pl
const inflacjapl = [
  {"year":2000,"jan":10.1,"feb":10.4,"mar":10.3,"apr":9.8,"may":10,"jun":10.2,"jul":11.6,"aug":10.7,"sep":10.3,"oct":9.9,"nov":9.3,"dec":8.5},
  {"year":2001,"jan":7.4,"feb":6.6,"mar":6.2,"apr":6.6,"may":6.9,"jun":6.2,"jul":5.2,"aug":5.1,"sep":4.3,"oct":4,"nov":3.6,"dec":3.6},
  {"year":2002,"jan":3.4,"feb":3.5,"mar":3.3,"apr":3,"may":1.9,"jun":1.6,"jul":1.3,"aug":1.2,"sep":1.3,"oct":1.1,"nov":0.9,"dec":0.8},
  {"year":2003,"jan":0.5,"feb":0.5,"mar":0.6,"apr":0.3,"may":0.4,"jun":0.8,"jul":0.8,"aug":0.7,"sep":0.9,"oct":1.3,"nov":1.6,"dec":1.7},
  {"year":2004,"jan":1.6,"feb":1.6,"mar":1.7,"apr":2.2,"may":3.4,"jun":4.4,"jul":4.6,"aug":4.6,"sep":4.4,"oct":4.5,"nov":4.5,"dec":4.4},
  {"year":2005,"jan":3.7,"feb":3.6,"mar":3.4,"apr":3,"may":2.5,"jun":1.4,"jul":1.3,"aug":1.6,"sep":1.8,"oct":1.6,"nov":1,"dec":0.7},
  {"year":2006,"jan":0.6,"feb":0.7,"mar":0.4,"apr":0.7,"may":0.9,"jun":0.8,"jul":1.1,"aug":1.6,"sep":1.6,"oct":1.2,"nov":1.4,"dec":1.4},
  {"year":2007,"jan":1.6,"feb":1.9,"mar":2.5,"apr":2.3,"may":2.3,"jun":2.6,"jul":2.3,"aug":1.5,"sep":2.3,"oct":3,"nov":3.6,"dec":4},
  {"year":2008,"jan":4,"feb":4.2,"mar":4.1,"apr":4,"may":4.4,"jun":4.6,"jul":4.8,"aug":4.8,"sep":4.5,"oct":4.2,"nov":3.7,"dec":3.3},
  {"year":2009,"jan":2.8,"feb":3.3,"mar":3.6,"apr":4,"may":3.6,"jun":3.5,"jul":3.6,"aug":3.7,"sep":3.4,"oct":3.1,"nov":3.3,"dec":3.5},
  {"year":2010,"jan":3.5,"feb":2.9,"mar":2.6,"apr":2.4,"may":2.2,"jun":2.3,"jul":2,"aug":2,"sep":2.5,"oct":2.8,"nov":2.7,"dec":3.1},
  {"year":2011,"jan":3.6,"feb":3.6,"mar":4.3,"apr":4.5,"may":5,"jun":4.2,"jul":4.1,"aug":4.3,"sep":3.9,"oct":4.3,"nov":4.8,"dec":4.6},
  {"year":2012,"jan":4.1,"feb":4.3,"mar":3.9,"apr":4,"may":3.6,"jun":4.3,"jul":4,"aug":3.8,"sep":3.8,"oct":3.4,"nov":2.8,"dec":2.4},
  {"year":2013,"jan":1.7,"feb":1.3,"mar":1,"apr":0.8,"may":0.5,"jun":0.2,"jul":1.1,"aug":1.1,"sep":1,"oct":0.8,"nov":0.6,"dec":0.7},
  {"year":2014,"jan":0.5,"feb":0.7,"mar":0.7,"apr":0.3,"may":0.2,"jun":0.3,"jul":-0.2,"aug":-0.3,"sep":-0.3,"oct":-0.6,"nov":-0.6,"dec":-1},
  {"year":2015,"jan":-1.4,"feb":-1.6,"mar":-1.5,"apr":-1.1,"may":-0.9,"jun":-0.8,"jul":-0.7,"aug":-0.6,"sep":-0.8,"oct":-0.7,"nov":-0.6,"dec":-0.5},
  {"year":2016,"jan":-0.9,"feb":-0.8,"mar":-0.9,"apr":-1.1,"may":-0.9,"jun":-0.8,"jul":-0.9,"aug":-0.8,"sep":-0.5,"oct":-0.2,"nov":0,"dec":0.8},
  {"year":2017,"jan":1.7,"feb":2.2,"mar":2,"apr":2,"may":1.9,"jun":1.5,"jul":1.7,"aug":1.8,"sep":2.2,"oct":2.1,"nov":2.5,"dec":2.1},
  {"year":2018,"jan":1.9,"feb":1.4,"mar":1.3,"apr":1.6,"may":1.7,"jun":2,"jul":2,"aug":2,"sep":1.9,"oct":1.8,"nov":1.3,"dec":1.1},
  {"year":2019,"jan":0.7,"feb":1.2,"mar":1.7,"apr":2.2,"may":2.4,"jun":2.6,"jul":2.9,"aug":2.9,"sep":2.6,"oct":2.5,"nov":2.6,"dec":3.4},
  {"year":2020,"jan":4.3,"feb":4.7,"mar":4.6,"apr":3.4,"may":2.9,"jun":3.3,"jul":3,"aug":2.9,"sep":3.2,"oct":3.1,"nov":3,"dec":2.4},
  {"year":2021,"jan":2.6,"feb":2.4,"mar":3.2,"apr":4.3,"may":4.7,"jun":4.4,"jul":5,"aug":5.5,"sep":5.9,"oct":6.8,"nov":7.8,"dec":8.6},
  {"year":2022,"jan":9.4,"feb":8.5,"mar":11,"apr":12.4,"may":13.9,"jun":15.5,"jul":15.6,"aug":16.1,"sep":17.2,"oct":17.9,"nov":17.5,"dec":16.6},
  {"year":2023,"jan":16.6,"feb":18.4,"mar":16.1,"apr":14.7,"may":13,"jun":11.5,"jul":10.8,"aug":10.1,"sep":8.2,"oct":6.6,"nov":6.6,"dec":6.2},
  {"year":2024,"jan":3.7,"feb":2.8,"mar":2.0,"apr":null,"may":null,"jun":null,"jul":null,"aug":null,"sep":null,"oct":null,"nov":null,"dec":null}
]

// edo historyczne
const edoHistoryczne=[
  {id:"EDO0434",firstYear:6.8,margin:1.5},
  {id:"EDO0334",firstYear:6.8,margin:1.5},
  {id:"EDO0234",firstYear:6.8,margin:1.5},
  {id:"EDO0134",firstYear:6.9,margin:1.5},
  
  {id:"EDO1233",firstYear:7,margin:1.5},
  {id:"EDO1133",firstYear:7,margin:1.5},
  {id:"EDO1033",firstYear:7.25,margin:1.5},
  {id:"EDO0933",firstYear:7.25,margin:1.25},
  {id:"EDO0833",firstYear:7.25,margin:1.25},
  {id:"EDO0733",firstYear:7.25,margin:1.25},
  {id:"EDO0633",firstYear:7.25,margin:1.25},
  {id:"EDO0533",firstYear:7.25,margin:1.25},
  {id:"EDO0433",firstYear:7.25,margin:1.25},
  {id:"EDO0333",firstYear:7.25,margin:1.25},
  {id:"EDO0233",firstYear:7.25,margin:1.25},
  {id:"EDO0133",firstYear:7.25,margin:1.25},

  {id:"EDO1232",firstYear:7.25,margin:1.25},
  {id:"EDO1132",firstYear:7.25,margin:1.25},
  {id:"EDO1032",firstYear:7.25,margin:1.25},
  {id:"EDO0932",firstYear:6.75,margin:1.25},
  {id:"EDO0832",firstYear:6.75,margin:1.25},
  {id:"EDO0732",firstYear:6.25,margin:1.25},
  {id:"EDO0632",firstYear:5.75,margin:1.25},
  {id:"EDO0532",firstYear:3.7,margin:1.25},
  {id:"EDO0432",firstYear:2.7,margin:1.25},
  {id:"EDO0332",firstYear:2.2,margin:1.25},
  {id:"EDO0232",firstYear:2.2,margin:1.25},
  {id:"EDO0132",firstYear:1.7,margin:1},

  {id:"EDO1231",firstYear:1.7,margin:1},
  {id:"EDO1131",firstYear:1.7,margin:1},
  {id:"EDO1031",firstYear:1.7,margin:1},
  {id:"EDO0931",firstYear:1.7,margin:1},
  {id:"EDO0831",firstYear:1.7,margin:1},
  {id:"EDO0731",firstYear:1.7,margin:1},
  {id:"EDO0631",firstYear:1.7,margin:1},
  {id:"EDO0531",firstYear:1.7,margin:1},
  {id:"EDO0431",firstYear:1.7,margin:1},
  {id:"EDO0331",firstYear:1.7,margin:1},
  {id:"EDO0231",firstYear:1.7,margin:1},
  {id:"EDO0131",firstYear:1.7,margin:1},
  
  {id:"EDO1230",firstYear:1.7,margin:1},
  {id:"EDO1130",firstYear:1.7,margin:1},
  {id:"EDO1030",firstYear:1.7,margin:1},
  {id:"EDO0930",firstYear:1.7,margin:1},
  {id:"EDO0830",firstYear:1.7,margin:1},
  {id:"EDO0730",firstYear:1.7,margin:1},
  {id:"EDO0630",firstYear:1.7,margin:1},
  {id:"EDO0530",firstYear:1.7,margin:1},
  {id:"EDO0430",firstYear:2.7,margin:1.5},
  {id:"EDO0330",firstYear:2.7,margin:1.5},
  {id:"EDO0230",firstYear:2.7,margin:1.5},
  {id:"EDO0130",firstYear:2.7,margin:1.5},

  {id:"EDO1229",firstYear:2.7,margin:1.5},
  {id:"EDO1129",firstYear:2.7,margin:1.5},
  {id:"EDO1029",firstYear:2.7,margin:1.5},
  {id:"EDO0929",firstYear:2.7,margin:1.5},
  {id:"EDO0829",firstYear:2.7,margin:1.5},
  {id:"EDO0729",firstYear:2.7,margin:1.5},
  {id:"EDO0629",firstYear:2.7,margin:1.5},
  {id:"EDO0529",firstYear:2.7,margin:1.5},
  {id:"EDO0429",firstYear:2.7,margin:1.5},
  {id:"EDO0329",firstYear:2.7,margin:1.5},
  {id:"EDO0229",firstYear:2.7,margin:1.5},
  {id:"EDO0129",firstYear:2.7,margin:1.5},

  {id:"EDO1228",firstYear:2.7,margin:1.5},
  {id:"EDO1128",firstYear:2.7,margin:1.5},
  {id:"EDO1028",firstYear:2.7,margin:1.5},
  {id:"EDO0928",firstYear:2.7,margin:1.5},
  {id:"EDO0828",firstYear:2.7,margin:1.5},
  {id:"EDO0728",firstYear:2.7,margin:1.5},
  {id:"EDO0628",firstYear:2.7,margin:1.5},
  {id:"EDO0528",firstYear:2.7,margin:1.5},
  {id:"EDO0428",firstYear:2.7,margin:1.5},
  {id:"EDO0328",firstYear:2.7,margin:1.5},
  {id:"EDO0228",firstYear:2.7,margin:1.5},
  {id:"EDO0128",firstYear:2.7,margin:1.5},

  {id:"EDO1227",firstYear:2.7,margin:1.5},
  {id:"EDO1127",firstYear:2.7,margin:1.5},
  {id:"EDO1027",firstYear:2.7,margin:1.5},
  {id:"EDO0927",firstYear:2.7,margin:1.5},
  {id:"EDO0827",firstYear:2.7,margin:1.5},
  {id:"EDO0727",firstYear:2.7,margin:1.5},
  {id:"EDO0627",firstYear:2.7,margin:1.5},
  {id:"EDO0527",firstYear:2.7,margin:1.5},

]

//coi(4) historyczne

const coiHistoryczne=[
  { id: 'COI0428', firstYear: 6.55, margin: 1.25 },
  { id: 'COI0328', firstYear: 6.55, margin: 1.25 },
  { id: 'COI0228', firstYear: 6.55, margin: 1.25 },
  { id: 'COI0128', firstYear: 6.65, margin: 1.25 },

  { id: 'COI1227', firstYear: 6.75, margin: 1.25 },
  { id: 'COI1127', firstYear: 6.75, margin: 1.25 },
  { id: 'COI1027', firstYear: 7, margin: 1.25 },
  { id: 'COI0927', firstYear: 7, margin: 1 },
  { id: 'COI0827', firstYear: 7, margin: 1 },
  { id: 'COI0727', firstYear: 7, margin: 1 },
  { id: 'COI0627', firstYear: 7, margin: 1 },
  { id: 'COI0527', firstYear: 7, margin: 1 },
  { id: 'COI0427', firstYear: 7, margin: 1 },
  { id: 'COI0327', firstYear: 7, margin: 1 },
  { id: 'COI0227', firstYear: 7, margin: 1 },
  { id: 'COI0127', firstYear: 7, margin: 1 },
  
  { id: 'COI1226', firstYear: 7, margin: 1 },
  { id: 'COI1126', firstYear: 7, margin: 1 },
  { id: 'COI1026', firstYear: 7, margin: 1 },
  { id: 'COI0926', firstYear: 6.50, margin: 1 },
  { id: 'COI0826', firstYear: 6.50, margin: 1 },
  { id: 'COI0726', firstYear: 6, margin: 1 },
  { id: 'COI0626', firstYear: 5.50, margin: 1 },
  { id: 'COI0526', firstYear: 3.30, margin: 1 },
  { id: 'COI0426', firstYear: 2.30, margin: 1 },
  { id: 'COI0326', firstYear: 1.8, margin: 1 },
  { id: 'COI0226', firstYear: 1.8, margin: 1 },
  { id: 'COI0126', firstYear: 1.3, margin: 0.75 },

  { id: 'COI1225', firstYear: 1.3, margin: 0.75 },
  { id: 'COI1125', firstYear: 1.3, margin: 0.75 },
  { id: 'COI1025', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0925', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0825', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0725', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0625', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0525', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0425', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0325', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0225', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0125', firstYear: 1.3, margin: 0.75 },

  { id: 'COI1224', firstYear: 1.3, margin: 0.75 },
  { id: 'COI1124', firstYear: 1.3, margin: 0.75 },
  { id: 'COI1024', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0924', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0824', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0724', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0624', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0524', firstYear: 1.3, margin: 0.75 },
  { id: 'COI0424', firstYear: 2.4, margin: 1.25 },
  { id: 'COI0324', firstYear: 2.4, margin: 1.25 },
  { id: 'COI0224', firstYear: 2.4, margin: 1.25 },
  { id: 'COI0124', firstYear: 2.4, margin: 1.25 }


]
//(6)
const rosHistoryczne = [
  { id: 'ROS0430', firstYear: 6.75, margin: 1.75 },
  { id: 'ROS0330', firstYear: 6.75, margin: 1.75 },
  { id: 'ROS0230', firstYear: 6.75, margin: 1.75 },
  { id: 'ROS0130', firstYear: 6.85, margin: 1.75 },

  { id: 'ROS1229', firstYear: 6.95, margin: 1.75 },
  { id: 'ROS1129', firstYear: 6.95, margin: 1.75 },
  { id: 'ROS1029', firstYear: 7.20, margin: 1.75 },
  { id: 'ROS0929', firstYear: 7.20, margin: 1.50 },
  { id: 'ROS0829', firstYear: 7.20, margin: 1.50 },
  { id: 'ROS0729', firstYear: 7.20, margin: 1.50 },
  { id: 'ROS0629', firstYear: 7.20, margin: 1.50 },
  { id: 'ROS0529', firstYear: 7.20, margin: 1.50 },
  { id: 'ROS0429', firstYear: 7.20, margin: 1.50 },
  { id: 'ROS0329', firstYear: 7.20, margin: 1.50 },
  { id: 'ROS0229', firstYear: 7.20, margin: 1.50 },
  { id: 'ROS0129', firstYear: 7.20, margin: 1.50 },
]

//(12)
const rodHistoryczne = [
  { id: 'ROD0436', firstYear: 7.05, margin: 2 },
  { id: 'ROD0336', firstYear: 7.05, margin: 2 },
  { id: 'ROD0236', firstYear: 7.05, margin: 2 },
  { id: 'ROD0136', firstYear: 7.15, margin: 2 },

  { id: 'ROD1235', firstYear: 7.25, margin: 2 },
  { id: 'ROD1135', firstYear: 7.25, margin: 2 },
  { id: 'ROD1035', firstYear: 7.50, margin: 2 },
  { id: 'ROD0935', firstYear: 7.50, margin: 1.75 },
  { id: 'ROD0835', firstYear: 7.50, margin: 1.75 },
  { id: 'ROD0735', firstYear: 7.50, margin: 1.75 },
  { id: 'ROD0635', firstYear: 7.50, margin: 1.75 },
  { id: 'ROD0535', firstYear: 7.50, margin: 1.75 },
  { id: 'ROD0435', firstYear: 7.50, margin: 1.75 },
  { id: 'ROD0335', firstYear: 7.50, margin: 1.75 },
  { id: 'ROD0235', firstYear: 7.50, margin: 1.75 },
  { id: 'ROD0135', firstYear: 7.50, margin: 1.75 },
]

const otsHistoryczne = [
  { id: 'OTS0724', rate: 3 },
  { id: 'OTS0624', rate: 3 },
  { id: 'OTS0524', rate: 3 },
  { id: 'OTS0424', rate: 3 },
  { id: 'OTS0324', rate: 3 },
  { id: 'OTS0224', rate: 3 },
  { id: 'OTS0124', rate: 3 },
]

const tosHistoryczne = [
  { id: 'TOS0427', rate: 6.4 },
  { id: 'TOS0327', rate: 6.4 },
  { id: 'TOS0227', rate: 6.4 },
  { id: 'TOS0127', rate: 6.5 },

  { id: 'TOS1226', rate: 6.6 },
  { id: 'TOS1126', rate: 6.6 },
  { id: 'TOS1026', rate: 6.85 },
  { id: 'TOS0926', rate: 6.85 },
  { id: 'TOS0826', rate: 6.85 },
  { id: 'TOS0726', rate: 6.85 },
  { id: 'TOS0626', rate: 6.85 },
  { id: 'TOS0526', rate: 6.85 },
  { id: 'TOS0426', rate: 6.85 },
  { id: 'TOS0326', rate: 6.85 },
  { id: 'TOS0226', rate: 6.85 },
  { id: 'TOS0126', rate: 6.85 },
]