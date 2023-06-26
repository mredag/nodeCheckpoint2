import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientForm = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [id, setId] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [patients, setPatients] = useState([]);


  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios
      .get('http://localhost:5000/api/patients')
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  };

  const handleAdd = () => {
    const patientData = {
      name,
      surname,
      appointmentTime,
    };

    axios
      .post('http://localhost:5000/api/patients', patientData)
      .then((response) => {
        console.log('Patient added:', response.data);
        
      })
      .catch((error) => {
        console.error('Error adding patient:', error);
      });
  };

  const handleUpdate = () => {
    if (!id) {
      setFeedback('Please provide an ID to update');
      return;
    }
  
    if (!name && !surname && !appointmentTime) {
      setFeedback('Please provide at least one field to update (name, surname, appointment time)');
      return;
    }
  
    const patientData = {};
  
    if (name) {
      patientData.name = name;
    }
  
    if (surname) {
      patientData.surname = surname;
    }
  
    if (appointmentTime) {
      patientData.appointmentTime = appointmentTime;
    }
  
    axios
      .put(`http://localhost:5000/api/patients/${id}`, patientData)
      .then((response) => {
        setFeedback('Patient updated successfully');
        // Optionally clear the fields after a successful update
        setName('');
        setSurname('');
        setAppointmentTime('');
        setId('');
      })
      .catch((error) => {
        setFeedback('Error updating patient');
        console.error('Error updating patient:', error);
      });
  };

  const handleDelete = () => {
    if (!id) {
      setFeedback('Please provide an ID to delete');
      return;
    }

    axios
      .delete(`http://localhost:5000/api/patients/${id}`)
      .then((response) => {
        console.log('Patient deleted:', response.data);
        // Handle successful patient deletion here (e.g. clear form fields)
        setName('');
        setSurname('');
        setAppointmentTime('');
        setId('');        
      })
      .catch((error) => {
        setFeedback('Error deleting patient');
        console.error('Error deleting patient:', error);
      });
  };


  return (
    <div>
      <h2>Patient Form</h2>

      {feedback && <div>{feedback}</div>}

      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="surname">Surname:</label>
      <input
        type="text"
        id="surname"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />

      <label htmlFor="appointmentTime">Appointment Time:</label>
      <input
        type="datetime-local"
        id="appointmentTime"
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
      />

      <label htmlFor="id">ID:</label>
      <input
        type="text"
        id="id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={handleAdd}>Add</button>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete}>Delete</button>

      <h2>All Patients</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient._id}>
            ID: {patient._id}, Name: {patient.name}, Surname: {patient.surname}, Appointment Time: {patient.appointmentTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientForm;
