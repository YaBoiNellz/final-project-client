/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
import { Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

const StudentView = (props) => {
  const { student, handleDelete } = props;

  // Render a single Student view 
  return (
    <Grid container spacing={2} style={{textAlign:"left", margin: "20px"}}>
      <Grid item xs={4}>
        <img src={student.imageUrl} alt={student.name} style = {{width: "100%"}} />
        
      </Grid>

      <Grid item xs={4}>
        <h3>Student Details</h3>
        <p><strong>NAME</strong><br /> {student.firstname + " " + student.lastname}</p>
        <p><strong>EMAIL</strong><br /> {student.email}</p>
        <p><strong>GPA:</strong> {student.gpa}</p>

        <Link to={`/student/${student.id}/edit`}>
          <Button variant="contained">Edit Student</Button>
        </Link>
        <br />
        <br />
        <Button variant="contained" color="secondary" onClick={(e) => handleDelete(student.id)}>Delete</Button>
      </Grid>

      <Grid item xs={4}>
        <h3>Campus</h3>
        {student.campus ? <><p>{student.campus.name}</p><Link to={`../campus/${student.campus.id}`}>Visit {student.campus.name} Page</Link></> : <p>Not enrolled</p> }
      </Grid>

    </Grid>
  );

};

export default StudentView;