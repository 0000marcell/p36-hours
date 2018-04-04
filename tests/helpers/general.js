import rsvp from 'rsvp';

export default {
  sleep(time){
    return new rsvp.Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time)
    });
  }
}
