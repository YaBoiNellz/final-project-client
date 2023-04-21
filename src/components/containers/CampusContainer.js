/*==================================================
CampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { fetchCampusThunk, deleteCampusThunk, fetchAllStudentsThunk, editStudentThunk } from "../../store/thunks";

import { CampusView } from "../views";

class CampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      studentId: null
    };
  }

  // Get the specific campus data from back-end database
  componentDidMount() {
    // Get campus ID from URL (API link)
    this.props.fetchCampus(this.props.match.params.id);
    this.props.fetchAllStudents();
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // handle when delete button is clicked
  handleDelete = (campusId) => {
    if(this.props.campus.students.length === 0){
      this.props.deleteCampus(campusId)
      .then(() => {
        this.setState({
          redirect: true,
        })
      }).catch(err => {});
    }else{
      alert("You can't delete this campus because it has students")
    }
    
  }

  // add an existing student to campus
  handleAddStudentToCampus = (e) => {
    e.preventDefault();
    this.updateStudentCampus(this.state.studentId, this.props.campus.id);
  }

  handleRemoveStudentFromCampus = (studentId) => {
    this.updateStudentCampus(studentId, null);
  }

  // make the db changes when student is added to database
  updateStudentCampus = async (studentId, campusId) => {
    const student = {
      id: studentId,
      campusId: campusId,
    }

    // Edit the student in back-end database
    await this.props.editStudent(student);

    // Update state, and trigger redirect to the updated student
    this.setState({
      studentId: null
    });

    // fetch the campus to rerender changes
    this.props.fetchCampus(this.props.match.params.id);
  }

  // Render a Campus view by passing campus data as props to the corresponding View component
  render() {
    if(this.state.redirect){
      return (<Redirect to={`/campuses`}/>)
    }
    
    return (
      <div>
        <Header />
        <CampusView 
        campus={this.props.campus}
        handleDelete={this.handleDelete}
        handleAddStudentToCampus={this.handleAddStudentToCampus}
        handleRemoveStudentFromCampus={this.handleRemoveStudentFromCampus}
        handleChange={this.handleChange}
        allStudents={this.props.allStudents}
        />
      </div>
    );
  }
}

// The following 2 input arguments are passed to the "connect" function used by "CampusContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "campus".
const mapState = (state) => {
  return {
    campus: state.campus,  // Get the State object from Reducer "campus"
    allStudents: state.allStudents,
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
  return {
    fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
    deleteCampus: (id) => dispatch(deleteCampusThunk(id)),
    fetchAllStudents: () => dispatch(fetchAllStudentsThunk()),
    editStudent: (student) => dispatch(editStudentThunk(student)),
  };
};

// Export store-connected container by default
// CampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(CampusContainer);