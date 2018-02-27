export default function(){
  this.transition(
    this.fromRoute('clock'),
    this.toRoute('statistics'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
