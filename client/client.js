let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");

let readline = require("readline");
//Read terminal Lines
let reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//Load the protobuflet
var proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("../proto/vacaciones.proto",{
     keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    })
);

const REMOTE_SERVER = "0.0.0.0:50050";
let id_employee;
let name;
let accrued_leave_days;
let requested_leave_days;
//Create gRPC
let employeeLeaveDaysService = new proto.work_leave.EmployeeLeaveDaysService(
    REMOTE_SERVER,
    grpc.credentials.createInsecure()
);

reader.question("Please enter the employee id: ", answer => {
    id_employee = answer;
    reader.question("Please enter the employee name: ", answer2 => {
        name = answer2;
        reader.question("Please enter the accrued_leave_days: ", answer3 => {
            accrued_leave_days = answer3;
            reader.question("Please enter the requested leave days: ", answer4 => {
                requested_leave_days = answer4;
                startResponse();
            });
        });
    });
});

let startResponse = () =>{
    employeeLeaveDaysService.eligibleForLeave({
        employee_id: id_employee,
        name: name,
        accrued_leave_days: accrued_leave_days,
        requested_leave_days: requested_leave_days
    }, (err, res) => {
        if(res.eligible){
            feedback();
        }else{
            console.log('{ granted: false, accrued_leave_days: ', accrued_leave_days,
            ' requested_leave_days: ', requested_leave_days, '}')
        }});
}

let feedback = () =>{
    employeeLeaveDaysService.grantLeave({
        employee_id: id_employee,
        name: name,
        accrued_leave_days: accrued_leave_days,
        requested_leave_days: requested_leave_days
    }, (err, res) => { console.log(res); });
}