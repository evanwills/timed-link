import { html, css, LitElement } from 'lit';
// import { repeat } from 'lit/directives/repeat';
import { customElement, property, state } from 'lit/decorators.js';
import { IDuration } from './vite-env';

@customElement('timed-link')
export class TimedLink extends LitElement {
  /**
   * URL for where link points to
   *
   * @var href
   */
  @property({ reflect: true, type: String })
  href : string = '';

  /**
   * ISO 8601 date/time string
   *
   * @var expiresAt
   */
  @property({ reflect: true, type: String })
  expiresAt : string = '';

  /**
   * Show long duration format
   * (e.g. 2 years, 4 months, 9 days, 1 hour, 7 minutes & 27 seconds)
   * short format would look like: 861 days 1:07:27 hours
   *
   * @var long
   */
  @property({ type: Boolean })
  long : boolean = false;

  /**
   * If expiry time is greater than midnight of the current day show
   * long date format (otherwise show long date format)
   *
   * @var hideAfterExpired
   */
  @property({ type: Boolean })
  hideAfterExpired : boolean = false;

  /**
   * If expiry time is greater than midnight of the current day show
   * long date format (otherwise show long date format)
   *
   * @var hideExpiredDuration
   */
  @property({ type: Boolean })
  hideExpiredDuration : boolean = false;

  /**
   * If expiry time is greater than midnight of the current day show
   * long date format (otherwise show long date format)
   *
   * @var expiresPrefix
   */
  @property({ type: String })
  expiresPrefix : string = 'Link';

  /**
   * Number of seconds left until link expires
   *
   * @var secondsRemaining
   */
  @state()
  secondsRemaining : number = 0;

  /**
   * Human readable representation of the number of seconds remainging
   *
   * @var humanRemaining
   */
  @state()
  humanRemaining : string = '';

  /**
   * Human readable representation of the number of seconds remainging
   *
   * @var humanEnd
   */
  @state()
  humanEnd : string = '';

  /**
   * Unix timestamp for when link expires
   *
   * @var endTimestamp
   */
  @state()
  endTime : Date = new Date();

  /**
   * Whether or not the link has already expired
   *
   * TRUE if the current time is before the expires time.
   * FALSE otherwise
   *
   * @var expired
   */
  @state()
  expired : boolean = false;

  /**
   * Whether or not everything has been intialised
   *
   * @var expired
   */
  @state()
  init : boolean = false;

  static styles = css`
    :root {
      --btn-colour: #fff;
      --btn-bg-colour: rgb(0, 85, 34);
      --btn-padding: 0.4rem 0.8rem;
      --txt-colour: #fff;
      --bg-colour: #2d2b2b;
      --border-radius: 0.85rem;
      --txt-decoration: none;
      --txt-decoration-hover: underline;
      --border-radius: 0.85rem;
    }
    a {
      text-decoration: inherit;
      color: inherit;
      font-family: inherit
    }
    a .link-text {
      background-color: var(--btn-bg-colour);
      border-radius: var(--border-radius, 0);
      color: var(--btn-colour);
      font-family: Arial, Helvetica, sans-serif;
      padding: var(--btn-padding, 0.4rem 0.8rem);
      text-decoration: var(--txt-decoration, none) !important;
    }

    a .link-text:hover, a .link-text:focus {
      text-decoration: var(--txt-decoration-hover, underline #fff);
    }
    a .msg {
      padding-left: 0.5rem;
      text-decoration: none !important;
    }
  `;

  /**
   * List of duration unit names & values
   *
   * @var units
   */
  private _units : IDuration = {
    years: 31557600, // 365.25 days
    months: 2629800, // 365.25 days / 12 months
    days: 86400, // 24 hours
    hours: 3600, // 60^2
    minutes: 60,
    seconds: 1
  };

  private _interval : number = -1;

  /**
   * Get plural "S" if appropriate for number
   *
   * @param input Number which determines plural or not
   *
   * @returns 's' if number should be a plural or
   *          '' (empty string) if not
   */
  _s (key: string, input : number) : string {
    return (input === 1)
      ? key.substring(0, key.length - 1)
      : key;
  }

  /**
   * Get the suffix for day of the month (e.g. 22 => 'nd')
   *
   * @param input Day of the month
   *
   * @returns suffix for day of the month
   */
  _th (input : number) : string {
    const num = (input < 0)
      ? input * -1
      : input

    if (num === 0) {
      return '';
    } else {
      const tmp : Array<string> = num.toString().match(/[0-9]?([0-9])$/);
      const ones = parseInt(tmp[1]);
      const tens = parseInt(tmp[0]);

      if (tens > 4 && tens < 20) {
        return 'th';
      } else {

        switch (ones) {
          case 0:
            return 'th';

          case 1:
            return 'st';

          case 2:
            return 'nd';

          case 3:
            return 'rd';

          default:
            return 'th';
        }
      }
    }
  }

  _getElapsedTimeInner (input : number) : IDuration {
    const output : IDuration = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
    // Compute time difference in milliseconds
    let timeDiff = (input >= 0)
      ? input
      : input * -1;

    let key: keyof typeof this._units;
    for (key in this._units) {
      if (timeDiff > this._units[key]) {
        output[key] = Math.floor(timeDiff / this._units[key]);

        timeDiff -= output[key] * this._units[key];
      }
    }

    return output;
  }

  /**
   * Get duration in Days, Hours, Minutes & Seconds
   *
   * e.g. 5 days, HH:MM:SS
   *
   * @param input Number of seconds
   *
   * @returns String listing all the non-zero values and their unit
   */
  _getElapsedTimeShort (input : number) : string {
    const timeBits = this._getElapsedTimeInner(input);
    let seconds = 0;
    let days = '';
    let time = '';

    let timeSep = '';
    let unit = '';

    let key: keyof typeof timeBits;
    for (key in timeBits) {
      if (key === 'years' || key === 'months' || key === 'days') {
        seconds += timeBits[key] * this._units[key];
      } else {
        if (timeBits[key] > 0 || time !== '') {
          const prefix = (time !== '' && timeBits[key] < 10)
            ? '0'
            : '';
          time += timeSep + prefix + timeBits[key] + '';
          timeSep = ':';
          if (unit === '') {
            unit = ' ' + this._s(key, timeBits[key])
          }
        }
      }
    }
    if (seconds > 0) {
      const tmp = (seconds / this._units.days);
      days = new Intl.NumberFormat('default', { maximumSignificantDigits: 0 }).format(tmp)
             + ' ' + this._s('days', tmp);
    }

    const sep = (days !== '' && time !== '')
      ? ', '
      : '';
    return days + sep + time + unit;
  }

  /**
   * Get duration in Years, Months, Days, Hours, Minutes & Seconds
   *
   * Units with a zero value will be omittted
   * e.g. 3 days, 5 hours, 17 minutes & 10 seconds
   *
   * @param input Number of seconds
   *
   * @returns String listing all the non-zero values and their unit
   */
  _getElapsedTimeLong (input : number) : string {
    const timeBits : IDuration = this._getElapsedTimeInner(input);

    let output : string = '';
    let sep = '';

    let key: keyof typeof timeBits;
    for (key in timeBits) {
      if (timeBits[key] > 0) {
        output += sep + timeBits[key] + ' ' + this._s(key, timeBits[key]);
        sep = ', ';
      }
    }

    return output.replace(/,(?= [^,]+$)/, ' &');
  }

  /**
   * Set the number of seconds remaining until the link expires
   */
  _setSecondsRemaining () : void {
    if (!this.expired || !this.hideExpiredDuration) {
      const tmp = Math.round((this.endTime.getTime() - Date.now()) / 1000);

      // Make sure seconds remaining is always positive
      if (tmp <= 0) {
        this.expired = true;
        this.secondsRemaining = tmp * -1;
      } else {
        this.secondsRemaining = tmp;
      }

      this.humanRemaining = (this.long)
        ? this._getElapsedTimeLong(this.secondsRemaining)
        : this._getElapsedTimeShort(this.secondsRemaining);
    }
  }

  /**
   * Do some one-off work to make everything run
   */
  _init() : void {
    if (this.init === false) {
      this.init = true;

      this.endTime = new Date(this.expiresAt)
      this._setSecondsRemaining();

      this.humanEnd = new Intl.DateTimeFormat(
        'default',
        { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' }
        ).format(this.endTime)

      if (this._interval === -1) {
        this._interval = setInterval(function (parent : TimedLink) { parent._setSecondsRemaining() }, 1000, this)
      }
    }
  }

  render() {
    this._init();

    return (this.expired === false)
      ? html`<a href="${this.href}" title="${this.expiresPrefix} expires on ${this.humanEnd}">
          <span class="link-text"><slot></slot></span>
          <span class="msg">(${this.expiresPrefix} expires in ${this.humanRemaining})</span>
        </a>`
      : (!this.hideAfterExpired)
        ? html`<span class="link link-expired" title="${this.expiresPrefix} expired on ${this.humanEnd}">
            <span class="link-text"><slot name="expired"><slot></slot></slot></span>
            ${(!this.hideExpiredDuration) ? html`<span class="msg">(${this.expiresPrefix} expired ${this.humanRemaining} ago)</span>` : ''}
          </span>`
        : '';
  }
}
