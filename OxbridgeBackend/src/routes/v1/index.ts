import express from 'express';
import apikey from '../../auth/apikey';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import reset from './access/reset';
import eventUser from './event/user';
import eventAdmin from './event/admin';
import eventRegistrationUser from './event_registration/user';
import eventRegistrationAdmin from './event_registration/admin';
import locationRegistrationUser from './location_registration/user';
import locationRegistrationAdmin from './location_registration/admin';
import racePointUser from './racepoint/user';
import racePointAdmin from './racepoint/admin';
import shipUser from './ship/user';
import shipAdmin from './ship/admin';
import userUser from './user/user';
import userAdmin from './user/admin';

const router = express.Router();

/**
  * Handles the routing of the application. The base route
  * is /v1/. Afterward, the routes can be seen below.
  */

// Below all APIs are public APIs protected by api-key
router.use('/', apikey);
// ---------------------------------------------------

// Access
router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/reset', reset);

// Event
router.use('/events', eventUser);
router.use('/admin/events', eventAdmin);

// Event registration
router.use('/eventRegistrations', eventRegistrationUser);
router.use('/admin/eventRegistrations', eventRegistrationAdmin);

// Location registration
router.use('/locationRegistrations', locationRegistrationUser);
router.use('/admin/locationRegistrations', locationRegistrationAdmin);

// Race point
router.use('/racepoints', racePointUser);
router.use('/admin/racepoints', racePointAdmin);

// Ship
router.use('/ships', shipUser);
router.use('/admin/ships', shipAdmin);

// User
router.use('/users', userUser);
router.use('/admin/users', userAdmin);

export default router;