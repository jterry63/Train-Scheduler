// Initialize Firebase
var config = {
    apiKey: "AIzaSyDN89u_w2W5tDY_E_tZB5-K8I0xxp0blZI",
    authDomain: "train-scheduler-aa53d.firebaseapp.com",
    databaseURL: "https://train-scheduler-aa53d.firebaseio.com",
    projectId: "train-scheduler-aa53d",
    storageBucket: "",
    messagingSenderId: "91529976684"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#submitTrain").on("click", function (event) {

    event.preventDefault();


    var trainName = $("#trainName").val().trim();
    var destination = $("#trainDest").val().trim();
    var firstTrain = $("#trainFirst").val().trim();
    var frequency = $("#trainFreq").val().trim();

    if (validateTime(firstTrain)) {

        database.ref("/Trains").push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        });

        $("#trainName").val("");
        $("#trainDest").val("");
        $("#trainFirst").val("");
        $("#trainFreq").val("");
    }


});

database.ref("/Trains").on("child_added", function (childSnapshot) {
    var frequency = childSnapshot.val().frequency
    var firstTimeConverted = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
    var minutesAway = frequency - (timeDifference % frequency);
    var nextTrain = moment().add(minutesAway, "minutes");

    $("#trainTable").append("<tr>" + "<td>" + childSnapshot.val().trainName + "</td>" +
        "<td>" + childSnapshot.val().destination + "</td>" +
        "<td>" + childSnapshot.val().frequency + "</td>" +
        "<td>" + moment(nextTrain).format("hh:mm A") + "</td>" +
        "<td>" + minutesAway + "</td>" + "</tr>");


}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

function validateTime(obj) {
    var timeValue = obj;
    if (timeValue == "" || timeValue.indexOf(":") < 0) {
        alert("Invalid Time format");
        return false;
    }
    else {
        var sHours = timeValue.split(':')[0];
        var sMinutes = timeValue.split(':')[1];

        if (sHours == "" || isNaN(sHours) || parseInt(sHours) > 23) {
            alert("Invalid Time format");
            return false;
        }
        else if (parseInt(sHours) == 0)
            sHours = "00";
        else if (sHours < 10)
            sHours = "0" + sHours;

        if (sMinutes == "" || isNaN(sMinutes) || parseInt(sMinutes) > 59) {
            alert("Invalid Time format");
            return false;
        }
        else if (parseInt(sMinutes) == 0)
            sMinutes = "00";
        else if (sMinutes < 10)
            sMinutes = "0" + sMinutes;

        obj = sHours + ":" + sMinutes;
    }

    return true;
}

