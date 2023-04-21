/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {
    campus, 
    handleDelete, 
    handleChange, 
    allStudents, 
    handleAddStudentToCampus, 
    handleRemoveStudentFromCampus
  } = props;
  
  // Render a single Campus view with list of its students
  return (
    
      <Grid container spacing={2} style={{margin: "20px", textAlign: "left"}}>
        <Grid item xs={4}>
          <h2>{campus.name}</h2>
          <img src={campus.imageUrl} alt={campus.name} style={{width: "100%"}} />
          <p><strong>ADDRESS</strong><br />{campus.address}</p>
          <p><strong>DESCRIPTION</strong><br />{campus.description}</p>

          <Link to={`../campus/${campus.id}/edit`}>
            <Button variant="contained">Edit</Button>
          </Link>

          <br />
          <br />

          <Button variant="contained" color="secondary" onClick={(e) => handleDelete(campus.id)}>Delete</Button>
        </Grid>

        <Grid item xs={8}>
          <h4>Add Student to Campus</h4>
          <form onSubmit={(e) => handleAddStudentToCampus(e)}>
            <label style={{color:'#11153e', fontWeight: 'bold'}}>Student Name: </label>
            <select name="studentId" required onChange={(e) => handleChange(e)}>
              <option value = ""> -- select student --</option>
              {
                allStudents.map((student) => {
                  return (
                    <option value={student.id} key={student.id}>{student.firstname + " " + student.lastname}</option>
                  );
                })
              }
            </select>
            <br />
            <Button type="submit" size="small" variant="contained">Add</Button>
          </form>

          
          <h4>Enrolled Students ({campus.students.length})</h4>

          {campus.students.length ? 

          <ol>
          {campus.students.map( student => {
            let name = student.firstname + " " + student.lastname;
            return (
              <li key={student.id}>
                <Link to={`/student/${student.id}`}>
                  <p>{name}</p>
                </Link>  

                <Button variant="contained" color="secondary" size="small" onClick={(e) => handleRemoveStudentFromCampus(student.id)}>Remove From Campus</Button> 

                        
              </li>
            );
          })}
          </ol>
          
          :

          <p>No students in campus</p>
          }
        </Grid>
      </Grid>

  );
};

export default CampusView;