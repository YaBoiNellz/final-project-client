/*==================================================
EditStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditStudentView from '../views/EditStudentView';
import { editStudentThunk, fetchStudentThunk, fetchAllCampusesThunk } from '../../store/thunks';

class EditStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    
    this.state = {
      firstname: "", 
      lastname: "", 
      email: "" ,
      imageUrl: "",
      campusId: null,
      gpa: "",
      redirect: false, 
      redirectId: null
    };
  }

  // Get the specific student data from back-end database
  componentDidMount() {
    // Get student ID from URL (API link)
    this.props.fetchStudent(this.props.match.params.id)
    .then(() => {
      // update the state once fetched from the store
      this.setState({
        firstname: this.props.student.firstname, 
        lastname: this.props.student.lastname, 
        email: this.props.student.email,
        imageUrl: this.props.student.imageUrl,
        campusId: this.props.student.campusId,
        gpa: this.props.student.gpa,    
      });
    });

    this.props.fetchAllCampuses();
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
    this.setState({redirect: false, redirectId: null});
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value.trim()
    });
  }

  // validate the user input
  validateInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if(name === "firstname" || name === "lastname" || name === "email"){
      if(value.length === 0){
        e.target.style.border = "1px solid red";
      }else{
        e.target.style.border = "initial";
      }
      
    }else if(name === "gpa"){
      if(this.isValidGPA(value)){
        e.target.style.border = "initial";
      }else{
        e.target.style.border = "1px solid red";
      }
    }
  }

  // check if the gpa provided is valid
  isValidGPA = (value) => {
    if(isNaN(value)){
      return false;
    }else{
      value = parseFloat(value);
      if(value < 0 || value > 4){
        return false;
      }else{
        return true;
      }
    }
  }

  validateAll = () => {
    if(this.state.firstname === "" || this.state.lastname === "" || this.state.email === ""){
      return false;
    }

    if((this.state.gpa !== null || this.state.gpa !== "") && !this.isValidGPA(this.state.gpa)){
      return false;
    }
    
    return true;
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.
    
    if(!this.validateAll()){
      alert("Please ensure that you have filled all required fields correctly before proceeding");
      return;
    }

    if(this.state.campusId === ""){
      this.setState({
        campusId: null,
      });
    }
    
    let imageUrl = this.state.imageUrl;
    
    let student = {
        id: this.props.match.params.id,  
        firstname: this.state.firstname, 
        lastname: this.state.lastname, 
        email: this.state.email,
        campusId: this.state.campusId,
        gpa: this.state.gpa,
    };

    if(imageUrl.length){
      student.imageUrl = imageUrl;
    }else{
      student.imageUrl = "https://img.freepik.com/free-vector/learning-concept-illustration_114360-3896.jpg?w=2000";
    }
    
    // Edit the student in back-end database
    await this.props.editStudent(student);

    // Update state, and trigger redirect to the updated student
    this.setState({
      firstname: "", 
      lastname: "", 
      email: "" ,
      imageUrl: "",
      campusId: null,
      gpa: "",
      redirect: true, 
      redirectId: student.id
    });
  }

  // Render edit student input form
  render() {
    // Redirect to student page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}
          student={this.props.student}   
          allCampuses={this.props.allCampuses} 
          validateInput={this.validateInput}       
        />
      </div>          
    );
  }
}

// The following 2 input arguments are passed to the "connect" function used by "EditStudentContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "student".
const mapState = (state) => {
  return {
    student: state.student,  // Get the State object from Reducer "student"
    allCampuses: state.allCampuses,
  };
};

// The following input argument is passed to the "connect" function used by "EditStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
      fetchStudent: (id) => dispatch(fetchStudentThunk(id)),  
      editStudent: (student) => dispatch(editStudentThunk(student)),
      fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
    })
}

// Export store-connected container by default
// EditStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);