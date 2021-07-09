import { enumify } from './Enumify.js'

const Enumify = enumify(1)

export class Certification extends Enumify {
  static ACROBAT = new Certification('Acrobat')
  static AVIATOR = new Certification('Aviator')
  static GOALKEEPER = new Certification('Goalkeeper')
  static GUARDIAN = new Certification('Guardian')
  static JUGGLER = new Certification('Juggler')
  static PARAGON = new Certification('Paragon')
  static PLAYMAKER = new Certification('Playmaker')
  static SCORER = new Certification('Scorer')
  static SHOW_OFF = new Certification('Show off')
  static SNIPER = new Certification('Sniper')
  static STRIKER = new Certification('Striker')
  static SWEEPER = new Certification('Sweeper')
  static TACTICIAN = new Certification('Tactician')
  static TURTLE = new Certification('Turtle')
  static VICTOR = new Certification('Victor')
}
