import { mail } from '../config';
import './EmailNotificationJob';

const nodemailer = require('nodemailer');

/**
  * Handles the the setup of the nodemailer object
  * to allow the application to send mails through
  * gmail's OAuth2 API service.
  */

export let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: mail.user,
    pass: mail.pass,
    clientId: mail.clientId,
    clientSecret: mail.clientSecret,
    refreshToken: mail.refreshToken
  },
});

