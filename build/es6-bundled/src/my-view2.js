define(["./my-app.js"],function(_myApp){"use strict";class MyView2 extends _myApp.PolymerElement{static get template(){return _myApp.html`
      <style include="shared-styles iron-flex iron-flex-alignment">
        :host {
          display: block;

          padding: 10px;
        }
        google-map {
        width: 500px;
        height: 400px;
      }
      </style>
     
      <google-map latitude="40.7555" longitude="-73.985" on-google-map-ready="_mapReady" fit-to-markers api-key="AIzaSyBmsetVvB1KlWoSbEXYQg1leRZO1PVPm_Q">
      <template is="dom-repeat" items="[[meetings]]" as="meeting">
        <google-map-marker slot="markers" click-events latitude="[[meeting.latLng.lat]]" longitude="[[meeting.latLng.lng]]" on-google-map-marker-click="_markerClick">
        </google-map-marker>
      </template>
      <plastic-map-info id="myinfocard" fade-in>
        <div class="layout vertical">
          <div style="width:100%; background-color: blue; font-weight: bold; color: white; padding: 5px 5px 5px 9px;">[[meeting.place]]</div>
          <div class="layout vertical" style="border: 2px solid blue; padding: 5px 5px 5px 9px;">
            <template is="dom-repeat" items="[[meeting.schedule]]" as="sch">
              <div class="layout horizontal">
                <paper-icon-button id="[[sch.meetingId]]" icon="social:person-add" on-tap="_attending"></paper-icon-button>
                <span>[[sch.meetingTime]]</span>
              </div>
            </template>
          </div>
        </div>
      </plastic-map-info>
    </google-map>
    <template is="dom-repeat" items="[[attending]]" as="a">
      <div>You are confirmed for a meeting at [[a.place]], [[a.meetingTime]]</div>
    </template>
    <div id="sources"></div>
    `}static get properties(){return{apiKey:{type:String,value:"AIzaSyAsblFIAb_-l6kS1DAd8rzE-TeQC2uSVW8",notify:!0},apiLoaded:{type:Boolean,value:!1,notify:!0},_theMap:{type:Object,value:null,notify:!0},meeting:{type:Object,notify:!0},meetings:{type:Array,value:function(){return[]}},attending:{type:Array,notify:!0,value:function(){return[]}}}}connectedCallback(){super.connectedCallback();this.meetings=[{locationId:"a20",latLng:{lat:40.750454,lng:-73.993519},place:"Pen Station / Madison Square Garden",schedule:[{meetingId:"m120",meetingTime:"07/01/2017 10:00am"},{meetingId:"m125",meetingTime:"07/05/2017 2:00pm"},{meetingId:"m130",meetingTime:"07/31/2017 11:00am"}]},{locationId:"a22",latLng:{lat:40.761449,lng:-73.977622},place:"MoMA",schedule:[{meetingId:"m121",meetingTime:"07/02/2017 10:30am"},{meetingId:"m126",meetingTime:"07/06/2017 3:00pm"}]},{locationId:"a24",latLng:{lat:40.74829,lng:-73.985599},place:"Empire State Building",schedule:[{meetingId:"m131",meetingTime:"07/29/2017 9:30am"},{meetingId:"m122",meetingTime:"08/02/2017 10:30am"},{meetingId:"m127",meetingTime:"08/06/2017 1:00am"},{meetingId:"m133",meetingTime:"08/29/2017 9:45am"}]}];setTimeout(()=>{this._showSource()},1e3)}_mapReady(){}_markerClick(e){this.meeting=e.model.get("meeting");this.$.myinfocard.showInfoWindow(e.target.marker)}_attending(e){var s=e.model.get("sch");this.push("attending",{place:this.meeting.place,meetingTime:s.meetingTime})}_showSource(){const mapMarkup=hljs.highlight("xml",`
    <google-map latitude="40.7555" longitude="-73.985" on-google-map-ready="_mapReady" fit-to-markers api-key="[[apiKey]]">
      <template is="dom-repeat" items="[[meetings]]" as="meeting">
        <google-map-marker slot="markers" click-events latitude="[[meeting.latLng.lat]]" longitude="[[meeting.latLng.lng]]" on-google-map-marker-click="_markerClick">
        </google-map-marker>
      </template>
      <plastic-map-info id="myinfocard" fade-in>
        <div class="layout verticle">
          <div style="width:100%; background-color: blue; font-weight: bold; color: white; padding: 5px 5px 5px 9px;">[[meeting.place]]</div>
          <div class="layout verticle" style="border: 2px solid blue; padding: 5px 5px 5px 9px;">
            <template is="dom-repeat" items="[[meeting.schedule]]" as="sch">
              <div class="layout horizontal">
                <paper-icon-button id="[[sch.meetingId]]" icon="social:person-add" on-tap="_attending"></paper-icon-button>
                <span>[[sch.meetingTime]]</span>
              </div>
            </template>
          </div>
        </div>
      </plastic-map-info>
    </google-map>
    <template is="dom-repeat" items="[[attending]]" as="a">
      <div>You are confirmed for a meeting at [[a.place]], [[a.meetingTime]]</div>
    </template>
    `);this.$.sources.innerHTML=`
    <h2>Basic Example with &lt;google-map&gt; Element</h2>
    <p>In this example the google-map and google-map-marker elements are used to create the map.</p>
    <h3>Markup</h3>
    <pre><code class="html">${mapMarkup.value}</code></pre>`;const jsCode=hljs.highlight("javascript",`
    _markerClick(e) {
      this.meeting = e.model.get('meeting');
      this.$.myinfocard.showInfoWindow(e.target.marker);
    }
    _attending(e) {
      var s = e.model.get('sch');
      this.push('attending', {
        place: this.meeting.place,
        meetingTime: s.meetingTime
      });
    }
    `);this.$.sources.innerHTML+=`<h3>Javascript</h3>
    <p>This illustrates handling the marker click event to show the infowindow and the handler on the paper-icon-button in the infowindow.</p>
    <pre><code class="javascript">${jsCode.value}</code></pre>`}}window.customElements.define("my-view2",MyView2)});