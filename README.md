# `<timed-link>`

`<timed-link>` is a web component to makes links expire at a given time. Before the link expires there is a count-down duration showing how long until the link expires.


-----

## Attriubtes

To allow for enough flexibility, this component has four attributes.

```html
<!-- Link expires on Tuesday, 22 February, 2022, 9:07:37 pm -->
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:37+1100">Download PDF</timed-link>
```

### `href` *{string}*

__Default:__ "" _[empty string]_

URL for thing that can only be downloaded for a limited time

### `expiresat` *{string}*

__Default:__ "" _[empty string]_

ISO8601 Date/Time string representing the date and time when the link will expire

### `long` *{boolean}*

__Default:__ `FALSE`

```html
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:37+1100" long></timed-link>
```

Show duration in long format.

Normally duration is displayed in short notation: `D (days?) HH:MM:SS hours` (if duration is longer than a day) or `H:MM:SS hours` for durations longer than an hour (but less than a day).

If `long` is true the duration is express as: _`YEARS`_` years, `_`MONTHS`_` months, `_`DAYS`_` days, `_`HOURS`_` hours, `_`MINUTES`_` minutes & `_`SECONDS`_` seconds`

### `hideExpired` *{boolean}*

__Default:__ `FALSE`

Hide the link (and everything associated with it) after it expires


```html
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:37+1100" hideExpired></timed-link>
```

### `expiresPrefix` *{string}*

__Default:__ `Link`


```html
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:37+1100" expiresprefix="PDF download"></timed-link>
```


-----

## Styling

To help make `<timed-link>` easier to integrate into applications
there are a number of css custom properties that allow the client
application to define various style properties.

> __NOTE:__ I may have got the behavior of setting values from
>           outside the component wrong so let me know if you
>           encounter any issues.

### CSS custom properties:


#### Accessibility - outline styles
