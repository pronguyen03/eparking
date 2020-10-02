import { trigger, state, style, transition, animate } from '@angular/animations';

export const onSideNavChange = trigger('onSideNavChange', [
  state(
    'close',
    style({
      'min-width': '50px',
    })
  ),
  state(
    'open',
    style({
      'min-width': '200px',
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);

export const onMainContentChange = trigger('onMainContentChange', [
  state(
    'hidden',
    style({
      'margin-left': '0px'
    })
  ),
  state(
    'close',
    style({
      'margin-left': '62px',
    })
  ),
  state(
    'open',
    style({
      'margin-left': '200px',
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
  transition('close => hidden', animate('250ms ease-in')),
  transition('open => hidden', animate('250ms ease-in')),
]);

export const animateText = trigger('animateText', [
  state(
    'hide',
    style({
      opacity: 0,
    })
  ),
  state(
    'show',
    style({
      opacity: 1,
    })
  ),
  transition('hide => show', animate('400ms ease-in')),
  transition('show => hide', animate('250ms ease-out')),
]);

export const indicatorRotate = trigger('indicatorRotate', [
  state(
    'collapsed',
    style({
      transform: 'rotate(0deg)',
    })
  ),
  state(
    'expanded',
    style({
      transform: 'rotate(180deg)',
    })
  ),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
]);
