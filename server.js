const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const mongodbConnectionString = 'mongodb+srv://tester:1234@lego-db.lssxr4t.mongodb.net/?retryWrites=true&w=majority';

async function connectToDatabase() {
    try {
      await mongoose.connect(mongodbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
    }
  }
  

connectToDatabase();

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  appointmentTime: {
    type: Date,
  },
});

const Patient = mongoose.model('Patient', patientSchema);

app.use(cors()); // Adding cors middleware
app.use(express.json());

app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { name, surname, appointmentTime } = req.body;
    const newPatient = new Patient({ name, surname, appointmentTime });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});


app.put('/api/patients/:id', async (req, res) => {
    try {
      const { name, surname, appointmentTime } = req.body;
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        { name, surname, appointmentTime },
        { new: true, runValidators: true }
      );
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      console.log(error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  app.delete('/api/patients/:id', async (req, res) => {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
