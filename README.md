# `<timed-link>`

`<timed-link>` is a web component to makes links expire at a given time. Before the link expires there is a count-down duration showing how long until the link expires.

There are times when you need a user to do something within a limited period of time e.g. selling tickets where you want to make the tickets release the tickets for purchase by someone else if a purchase isn't made within the time limit.

-----

## Attriubtes

To allow for enough flexibility, this component has six attributes.

```html
<!-- Link expires on Tuesday, 22 February, 2022, 9:07:39 pm -->
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:39+1100">
  Download PDF
</timed-link>
```

### `href` *{string}* (required)

__Default:__ "" _[empty string]_

URL for thing that can only be downloaded for a limited time

### `expiresat` *{string}* (required)

__Default:__ "" _[empty string]_

ISO8601 Date/Time string representing the date and time when the link will expire

### `expires-prefix` *{string}*

__Default:__ `Link`


```html
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:37+1100" expiresprefix="Download">
  Get your free ebook
</timed-link>
```

When the duration is displayed the text "_`Link` expires in 10:30 minutes_" (or whatever the remaining time is). By specifying the `expiresprefix` you can alter the expires text e.g. _`Download expires in 10:30 minutes`_


### `long` *{boolean}*

__Default:__ `FALSE`

```html
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:37+1100" long>
  Download PDF (13kb)
</timed-link>
```

Show duration in long format.

Normally duration is displayed in short notation: `D (days?) HH:MM:SS hours` (if duration is longer than a day) or `H:MM:SS hours` for durations longer than an hour (but less than a day).

If `long` is true the duration is express as: _`YEARS`_` years, `_`MONTHS`_` months, `_`DAYS`_` days, `_`HOURS`_` hours, `_`MINUTES`_` minutes & `_`SECONDS`_` seconds`

e.g. `2 months, 3 days, 7 hours, 9 minutes & 30 seconds`

### `hideafterexpired` *{boolean}*

__Default:__ `FALSE`

```html
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:37+1100" hideafterexpired>
  Download PDF (13kb)
</timed-link>
```

Hide the link (and everything associated with it) after it expires

### `hideexpiredduration` *{boolean}*

__Default:__ `FALSE`

```html
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:37+1100" hideexpiredduration>
  Download PDF (13kb)
</timed-link>
```

Hide the link (and everything associated with it) after it expires

-----


## Slots

Link text should be added as the contents of the element.

If you wish to show different text after the link has expired include an extra element with the slot name: `expired`

e.g.
```html
<timed-link href="https://www.google.com" expiresat="2022-02-22T21:07:37+1100" hide-expired-duration>
  Download PDF (13kb)
  <p slot="expired">Too bad, you missed out</p>
</timed-link>
```

When the link expires, you will `Too bad, you missed out` where the link was before it expired.


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
