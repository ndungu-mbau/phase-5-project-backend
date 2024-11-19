// Define roles and permissions for each model
import { AccessControl } from 'accesscontrol'

const ac = new AccessControl()

// Admin can do anything
ac.grant('admin')
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

ac.grant('user')
  .readAny('homes')
  .createAny('donations')
  .readAny('donations')
  .createAny('visits')
  .readAny('visits')
  .createAny('reviews')
  .readAny('reviews')

// Export the AccessControl instance
export default ac
