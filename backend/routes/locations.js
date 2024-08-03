const express = require('express');
const { ObjectId } = require("mongodb");
const MongoCRUDs = require('../mongodb/mongoCRUDs');
const mongoCRUDs = new MongoCRUDs();

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const locations = await mongoCRUDs.getAllLocations();
        res.json(locations);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const location = await mongoCRUDs.getLocation(req.params.id);
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).send('Location not found');
        }
    } catch (err) {
        res.status(500).send('Server Error');
        console.log(err)
    }
});

router.post('/', async (req, res) => {
    try {
        const locationId = await mongoCRUDs.createLocation(req.body);
        res.status(201).json({ locationId });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id); // Umwandlung der ID in ein ObjectId
        const updated = await mongoCRUDs.updateLocation(id, req.body);
        if (updated.modifiedCount === 0) {
            res.status(404).send('Location not found or data not modified');
        } else {
            res.status(204).send();
        }
    } catch (err) {
        res.status(500).send('Server Error');
        console.log(err)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id); // Umwandlung der ID in ein ObjectId
        const deleted = await mongoCRUDs.deleteLocation(id);
        if (deleted.deletedCount === 0) {
            res.status(404).send('Location not found');
        } else {
            res.status(200).send('Location deleted');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});



module.exports = router;
