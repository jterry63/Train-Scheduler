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

$("#submitTrain").on('click', function () {


    var trainName = $('#trainName').val().trim();
    var trainDest = $('#trainDest').val().trim();
    var trainFirst = $('#trainFirst').val().trim();
    var trainFreq = $('#trainFreq').val().trim();
    event.preventDefault();

    var newTrain = {
        trainsName: trainName,
        destination: trainDest,
        firstTrain: trainFirst,
        frequency: trainFreq,
        timeAdded: firebase.database.ServerValue.TIMESTAMP,
    };

    database.ref("/Trains").push(newTrain);

    // console.log(newTrain.name);
    // console.log(newTrain.destination);
    // console.log(newTrain.first);
    // console.log(newTrain.frequency);

    $("#trainName").val("")
    $("#trainDest").val("")
    $("#trainFirst").val("")
    $("#trainFreq").val("")

});

database.ref("/Trains").on("child_added", function (childSnapshot) {

    // console.log(snapshot.val().name);
    // console.log(snapshot.val().destination);
    // console.log(snapshot.val().first);
    // console.log(snapshot.val().frequency);

    var time = moment(new Date(childSnapshot.val().timeAdded));
    var freq = childSnapshot.val().frequency
    var start = parseInt(childSnapshot.val().firstTrain);
    //===============

    start = moment(start, 'HHmm')
    var timeDiff = time.diff(start, 'minutes')
    //============

    // time = time.format("hh mm A");
    // var timeDiff = time.diff(start, 'minutes')
    timeDiff = parseInt(timeDiff);
    var minAway = freq - (timeDiff % freq);
    var nextTrain = moment(time).add(minAway, 'minutes')
    nextTrain = nextTrain.format("hh:mm A")

    $('#trainTable').append(
        "<tr>" +
        "<td> " + childSnapshot.val().trainsName + " </td>" +
        "<td> " + childSnapshot.val().destination + " </td>" +
        "<td> " + childSnapshot.val().frequency + " </td>" +
        "<td>" + nextTrain + "</td>" +
        "<td>" + minAway + "</td>" +
        "<td></td>" +

        "</tr>"
    )
});