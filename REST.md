## Classes

<dl>
<dt><a href="#DateTemps">DateTemps</a></dt>
<dd><p>Representation of maximum and minimum temperatures for a date.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#GET /historical/">GET /historical/</a> ⇒ <code>array</code></dt>
<dd><p>GET all available data</p>
</dd>
<dt><a href="#GET /historical/">GET /historical/(date)</a> ⇒ <code><a href="#DateTemps">DateTemps</a></code></dt>
<dd><p>GET available data for given date</p>
</dd>
<dt><a href="#POST /historical/">POST /historical/(date)</a> ⇒ <code>object</code></dt>
<dd><p>POST new data for given date</p>
</dd>
<dt><a href="#DELETE /historical/">DELETE /historical/(date)</a> ⇒ <code>object</code></dt>
<dd><p>DELETE data for given date</p>
</dd>
<dt><a href="#GET /forecast/">GET /forecast/(date)</a> ⇒ <code>array</code></dt>
<dd><p>GET a week&#39;s forecasted data from the given date</p>
</dd>
</dl>

<a name="DateTemps"></a>

## DateTemps
Representation of maximum and minimum temperatures for a date.

**Kind**: global class  
<a name="new_DateTemps_new"></a>

### new DateTemps(date, max, min)
Create a DateTemps.


| Param | Type | Description |
| --- | --- | --- |
| date | <code>number</code> | The given date in YYYYMMDD format. |
| max | <code>number</code> | The maximum temperature for this date. |
| min | <code>number</code> | The minimum temperature for this date. |

<a name="GET /historical/"></a>

## GET /historical/ ⇒ <code>array</code>
GET all available data

**Kind**: global function  
**Returns**: <code>array</code> - An array of all available dates (not DateTemps).  
<a name="GET /historical/"></a>

## GET /historical/(date) ⇒ <code>[DateTemps](#DateTemps)</code>
GET available data for given date

**Kind**: global function  
**Returns**: <code>[DateTemps](#DateTemps)</code> - Temperature data for the requested date.  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>number</code> | Requested date in YYYYMMDD format. |

<a name="POST /historical/"></a>

## POST /historical/(date) ⇒ <code>object</code>
POST new data for given date

**Kind**: global function  
**Returns**: <code>object</code> - Object with new date key/value.  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>[DateTemps](#DateTemps)</code> | DateTemps object containing new data. |

<a name="DELETE /historical/"></a>

## DELETE /historical/(date) ⇒ <code>object</code>
DELETE data for given date

**Kind**: global function  
**Returns**: <code>object</code> - Information regarding records deleted.  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>number</code> | The given date to be deleted. |

<a name="GET /forecast/"></a>

## GET /forecast/(date) ⇒ <code>array</code>
GET a week's forecasted data from the given date

**Kind**: global function  
**Returns**: <code>array</code> - Array of DateTemps objects for forecast.  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>date</code> | Date to begin 7-day forecast from. |

