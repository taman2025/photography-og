
<?php
    // Database connection
    $conn = new mysqli("localhost", "root", "", "enquiry");

    if($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $t1 =$_POST["PhoneNumber"];
    $t2 =$_POST["Message"];
    $query = "INSERT INTO enquirytable (PhoneNumber, Message) VALUES ('$t1', '$t2')";
    $result = $conn->query($query);
    echo "<script>window.location.href = 'portfolio.html';</script>";
    $conn->close();

?>



