

var work_orders = [
    {
      facility: "Fac1",
      equipment_type: "Pump",
      equipment_id: "P032",
      priority: 5,
      hours: 3,
    },
    {
      facility: "Fac3",
      equipment_type: "Conveyer",
      equipment_id: "Con391",
      priority: 1,
      hours: 9,
    },
    {
      facility: "Fac4",
      equipment_type: "Seperator",
      equipment_id: "Sep028",
      priority: 2,
      hours: 3,
    },
    {
      facility: "Fac5",
      equipment_type: "Sensor",
      equipment_id: "Sen826",
      priority: 4,
      hours: 1,
    },
    {
      facility: "Fac1",
      equipment_type: "Security",
      equipment_id: "Sec032",
      priority: 1,
      hours: 2,
    },
    {
      facility: "Fac5",
      equipment_type: "Electricity",
      equipment_id: "El087",
      priority: 3,
      hours: 2,
    },
    {
      facility: "Fac1",
      equipment_type: "Networking",
      equipment_id: "Net012",
      priority: 3,
      hours: 4,
    },
    {
      facility: "Fac1",
      equipment_type: "Vehicle",
      equipment_id: "V053",
      priority: 4,
      hours: 4,
    },
    {
      facility: "Fac2",
      equipment_type: "HVAC",
      equipment_id: "HVAC021",
      priority: 2,
      hours: 18,
    },
    {
      facility: "Fac3",
      equipment_type: "Compressor",
      equipment_id: "Com471",
      priority: 5,
      hours: 9,
    },
    {
      facility: "Fac5",
      equipment_type: "Security",
      equipment_id: "Sec174",
      priority: 2,
      hours: 2,
    },
    {
      facility: "Fac2",
      equipment_type: "Vehicle",
      equipment_id: "Veh279",
      priority: 2,
      hours: 1,
    },
    {
      facility: "Fac3",
      equipment_type: "Electricity",
      equipment_id: "El649",
      priority: 5,
      hours: 6,
    },
    {
      facility: "Fac2",
      equipment_type: "Pump",
      equipment_id: "P595",
      priority: 2,
      hours: 9,
    },
    {
      facility: "Fac2",
      equipment_type: "Conveyer",
      equipment_id: "Con281",
      priority: 3,
      hours: 7,
    },
    {
      facility: "Fac3",
      equipment_type: "HVAC",
      equipment_id: "HVAC361",
      priority: 5,
      hours: 14,
    },
    {
      facility: "Fac4",
      equipment_type: "Networking",
      equipment_id: "Net109",
      priority: 1,
      hours: 3,
    },
    {
      facility: "Fac5",
      equipment_type: "Seperator",
      equipment_id: "Sep789",
      priority: 5,
      hours: 3,
    },
    {
      facility: "Fac5",
      equipment_type: "Compressor",
      equipment_id: "Com352",
      priority: 5,
      hours: 13,
    },
    {
      facility: "Fac1",
      equipment_type: "Sensor",
      equipment_id: "Sen551",
      priority: 1,
      hours: 1,
    },
    {
      facility: "Fac5",
      equipment_type: "Vehicle",
      equipment_id: "Veh236",
      priority: 1,
      hours: 1,
    },
    {
      facility: "Fac5",
      equipment_type: "Conveyer",
      equipment_id: "Con120",
      priority: 3,
      hours: 3,
    },
    {
      facility: "Fac2",
      equipment_type: "Sensor",
      equipment_id: "Sen012",
      priority: 2,
      hours: 10,
    },
    {
      facility: "Fac4",
      equipment_type: "Compressor",
      equipment_id: "Com250",
      priority: 2,
      hours: 5,
    },
    {
      facility: "Fac3",
      equipment_type: "Seperator",
      equipment_id: "Sep775",
      priority: 1,
      hours: 4,
    },
    {
      facility: "Fac2",
      equipment_type: "Pump",
      equipment_id: "Pum102",
      priority: 3,
      hours: 2,
    },
    {
      facility: "Fac2",
      equipment_type: "Electricity",
      equipment_id: "El098",
      priority: 4,
      hours: 3,
    },
    {
      facility: "Fac1",
      equipment_type: "Security",
      equipment_id: "Sec032",
      priority: 5,
      hours: 1,
    },
    {
      facility: "Fac1",
      equipment_type: "Electricity",
      equipment_id: "El101",
      priority: 3,
      hours: 4,
    },
    {
      facility: "Fac3",
      equipment_type: "HVAC",
      equipment_id: "HVAC997",
      priority: 2,
      hours: 6,
    }]

var facilities = [
    {
      facilityId: "Fac1",
      location: {
          type:"Point",
          coordinates:[-95.372003, 29.755537]
        }
    },
    {
      facilityId: "Fac2",
      location: {
        type:"Point",
        coordinates:[-95.409329, 29.716361]
      }
    },
    {
      facilityId: "Fac3",
      location: {
        type:"Point",
        coordinates:[-95.401964, 29.712818]
      }
    },
    {
      facilityId: "Fac4",
      location: {
        type:"Point",
        coordinates:[-95.399359, 29.721943]
      }
    },
    {
      facilityId: "Fac5",
      location: {
        type:"Point",
        coordinates:[-95.401923, 29.717913]
      }
    }
]

var workers = [
    {
      name: "Bob",
      certifications: ["Sensor", "Security", "Networking"],
      shift: true
    },
    {
      name: "Sally",
      certifications: ["Pump", "HVAC"],
      shift: true
    },
    {
      name: "Marcus",
      certifications: ["Vehicle"],
      shift: true
    },
    {
      name: "Jackie",
      certifications: ["Conveyor", "Seperator"],
      shift: true
    },
    {
      name: "Jacob",
      certifications: ["Compressor", "Electricity"],
      shift: true
    },
    {
      name: "Lilly",
      certifications: ["Sensor", "Security", "Networking"],
      shift: false
    },
    {
      name: "Mohammed",
      certifications: ["Pump", "HVAC"],
      shift: false
    },
    {
      name: "Celeste",
      certifications: ["Vehicle"],
      shift: false
    },
    {
      name: "Andrew",
      certifications: ["Conveyor", "Seperator"],
      shift: false
    },
    {
      name: "Anh",
      certifications: ["Compressor", "Electricity"],
      shift: false
    }
]


module.exports = {
    work_orders: work_orders,
    workers: workers,
    facilities: facilities
}