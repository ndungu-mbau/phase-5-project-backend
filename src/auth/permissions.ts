// Define roles and permissions for each model
import { AccessControl } from 'accesscontrol'

const ac = new AccessControl()

// Admin can do anything
ac.grant('admin')
  .createAny('admin')
  .createAny('homes')
  .readAny('homes')
  .updateAny('homes')
  .deleteAny('homes')
  .createAny('donations')
  .readAny('donations')
  .updateAny('donations')
  .deleteAny('donations')
  .createAny('visits')
  .readAny('visits')
  .updateAny('visits')
  .deleteAny('visits')
  .createAny('reviews')
  .readAny('reviews')
  .updateAny('reviews')
  .deleteAny('reviews')

// User Roles
ac.grant('user')
  .readAny('homes')
  .createAny('donations')
  .readOwn('donations')
  .createAny('visits')
  .readAny('visits')
  .createAny('reviews')
  .readAny('reviews')

// Export the AccessControl instance
export default ac
