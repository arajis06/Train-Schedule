var firebaseConfig = {
    apiKey: "AIzaSyDSepEZJjZzCLvts1QGzaVPNUExE_SkkB4",
    authDomain: "train-schedule-7685e.firebaseapp.com",
    databaseURL: "https://train-schedule-7685e.firebaseio.com",
    projectId: "train-schedule-7685e",
    storageBucket: "train-schedule-7685e.appspot.com",
    messagingSenderId: "337294394288",
    appId: "1:337294394288:web:d644743fc03b9f0c"
  };
// INITIALIZING FIREBASE
firebase.initializeApp(firebaseConfig);

// CREATING A VARIABLE TO REFERENCE THE DATABASE 
var database = firebase.database();

// INITIAL VALUES
var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;

//FUNCTION FOR DISPLAYING CURRENT TIME=========================================================
function currentTime() {
  var current = moment().format('LT');
  $("#current-time").html("Time: " + current);
  setTimeout(currentTime, 1000);
  //TESTING CURRENT TIME
	console.log(current);
};

$("#submit").on("click", function(event) {
  // PREVENT PAGE FROM REFRESHING
   event.preventDefault();
  //IF USER LEAVES A INPUT FIELD BLANK...
  if ($("#train-name").val().trim() === "" ||
      $("#destination").val().trim() === "" ||
      $("#first-train").val().trim() === "" ||
      $("#frequency").val().trim() === "") {
    //CREATE AN ALERT TO FILL MISSING INFO BEFORE SUBMITTING
    alert("Please fill in all details to add new train");
    
  } 
  //ELSE IF ALL INPUT IS FILLED IN...
  else {
    //GRAB USER INPUT
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

//CREATING LOCAL "temporary" OBJECT FOR HOLDING INPUTS    
    $(".form-field").val("");
      //SETTING THE NEW VALUES TO DATABASE IN FIREBASE 
      database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        startTime: startTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

  }

});
//CREATING FIREBASE EVENT FOR ADDING TRAIN TO THE DATABASE...
database.ref().on("child_added", function(childSnapshot) {
  var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
  var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
  var timeRemain = timeDiff % childSnapshot.val().frequency;
  var minToArrival = childSnapshot.val().frequency - timeRemain;
  var nextTrain = moment().add(minToArrival, "minutes");
  var key = childSnapshot.key;
//AND A ROW IN THE HTML WHEN USER ADDS A ENTRY
  var newrow = $("<tr>");
  newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
  newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
  newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
  newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
  newrow.append($("<td class='text-center'><button class='remove btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));


  //APPENDING NEW TRAIN INFO
  $("#train-table-rows").append(newrow);

});
//DELETES INFO ON REMOVE BUTTON CLICK
$(document).on("click", ".remove", function() {
  keyref = $(this).attr("data-key");
  database.ref().child(keyref).remove();
  window.location.reload();
});

currentTime();

setInterval(function() {
  window.location.reload();
}, 60000);
