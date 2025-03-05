<?php
    // Database connection
    $conn = new mysqli("localhost", "root", "", "booking");

    if($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $t1 =$_POST["name"];
    $t2 =$_POST["email"];
    $t3 =$_POST["number"];
    $t4 =$_POST["eventdate"];
    $t6 =$_POST["eventaddress"];
    $t7 =$_POST["packages"];
    $t8 =$_POST["pricing"];
    

    $query = "INSERT INTO bookingtable (name, email,number,eventdate,eventaddress,packages,pricing) VALUES ('$t1', '$t2','$t3','$t4','$t6','$t7','$t8')";
    $result = $conn->query($query);
    echo "<script>window.location.href = 'portfolio.html';</script>";

    $conn->close();

?>