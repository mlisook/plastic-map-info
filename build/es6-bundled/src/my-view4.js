define(["./my-app.js"],function(_myApp){"use strict";class MyView4 extends(0,_myApp.GestureEventListeners)(_myApp.PolymerElement){static get template(){return _myApp.html`
        <style include="shared-styles iron-flex iron-flex-alignment">
          :host {
            display: block;
  
            padding: 10px;
          }
          google-map {
          width: 500px;
          height: 400px;
        }
        plastic-map-info {
        --plastic-map-info-mixin: {
          background-color: transparent;
          border-bottom: solid red;
          color: red;
          padding: 10px 18px 5px 5px;
          border-radius: 2px;
          max-width: 75%;
        }
        ;
      }

      paper-button.redwhite {
        background-color: red;
        color: white;
        font-family: 'Roboto', 'Noto', sans-serif;
        cursor: pointer;
      }
        </style>
      
        <google-map id="v4map" on-google-map-ready="_mapReady" fit-to-markers api-key="AIzaSyBmsetVvB1KlWoSbEXYQg1leRZO1PVPm_Q">
        <template is="dom-repeat" items="[[towers]]" as="t">
          <google-map-marker slot="markers" click-events latitude="[[t.lat]]" longitude="[[t.lng]]" on-google-map-marker-click="_markerClick" >
          </google-map-marker>
        </template>
        <plastic-map-info id="myinfocard" fade-in>
        <div class="layout horizontal">
          <div>
            <img src$="[[tower.imgUrl]]" style="height: 100px; width: 60px;" />
          </div>
          <div class="layout vertical" style="padding-left: 5px;">
            <div style="font-weight: bold; font-family: 'Roboto', 'Noto', sans-serif; font-size: 11pt; color: maroon;">
              [[tower.tower]]
            </div>
            <div style="font-weight: bold; font-family: 'Roboto', 'Noto', sans-serif; font-size: 9pt;">
              [[tower.description]]
            </div>
            <div style="margin-top: 9px;">
              <paper-button class="redwhite" raised on-tap="nextTower">Next Tower</paper-button>
            </div>
          </div>
        </div>
        <div slot="info-beak">
          <svg width="120" height="80">
            <defs>
              <path id="beaktext" d="M 17,20 L 62,80" />
            </defs>
            <line x1="7.5" y1="10" x2="60" y2="80" style="stroke:rgb(255,0,0);stroke-width:2" />
            <text style="font-size: 9pt; stroke: red;">
              <textPath xlink:href="#beaktext">
                [[tower.tower]]
              </textPath>
            </text>
          </svg>
        </div>
        </plastic-map-info>
      </google-map>
      <div id="sources"></div>
      `}static get properties(){return{towers:{type:Array,notify:!0},tower:{type:Object,notify:!0}}}connectedCallback(){super.connectedCallback();this.towers=[{tower:"Tokyo Skytree",idx:0,description:"Tokyo Skytree is a broadcasting, restaurant, and observation tower in Sumida, Tokyo, Japan. It is of 634.0 metres (2,080 ft) tall,making it the tallest tower in the world,",lat:35.71,lng:139.81046,imgUrl:"https://res.cloudinary.com/davo7aym4/image/upload/w_100/v1529359948/Tokyo_Sky_Tree_u1vj7e.jpg"},{tower:"Canton Tower",idx:1,description:"Canton Tower is a 595.7-metre (1,954 ft) tall multi-purpose observation tower in the Haizhu District of Guangzhou, Guangdong, China. It is the second tallest tower in the world.",lat:23.106397,lng:113.32453,imgUrl:"https://res.cloudinary.com/davo7aym4/image/upload/w_100/v1529359948/Canton_tower_gol26v.jpg"},{tower:"CN Tower",idx:2,description:"The CN Tower is a 553.33 m-high (1,815.4 ft) concrete communications and observation tower in downtown Toronto, Ontario, Canada",lat:43.64255,lng:-79.387,imgUrl:"https://res.cloudinary.com/davo7aym4/image/upload/w_100/v1529359949/CN_Tower_baqlly.jpg"},{tower:"Space Needle",idx:3,description:"The Space Needle is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle. It is 605 ft (184 m) high. ",lat:47.62405,lng:-122.349277,imgUrl:"https://res.cloudinary.com/davo7aym4/image/upload/w_100/v1529359948/Space_Needle_jjm80y.jpg"},{tower:"Eiffel Tower",idx:4,description:"The Eiffel Tower is a wrought iron lattice tower on the Champ de Mars in Paris, France.",lat:48.858349,lng:2.294358,imgUrl:"https://res.cloudinary.com/davo7aym4/image/upload/w_100/v1529359948/Tour_Eiffel_ydkdbw.jpg"}];setTimeout(()=>{this._showSource()},1e3)}_mapReady(){}_markerClick(e){this.tower=e.model.get("t");this.$.myinfocard.showInfoWindow(e.target.marker)}nextTower(){let nextTowerIdx=4<=this.tower.idx?0:this.tower.idx+1,nextMarker=this.$.v4map.markers[nextTowerIdx].marker;this.$.myinfocard.close();nextMarker.map.panTo(nextMarker.getPosition());nextMarker.map.setZoom(4);this.tower=this.towers[nextTowerIdx];this.$.myinfocard.showInfoWindow(nextMarker)}_showSource(){const mapMarkup=hljs.highlight("xml",`
        <google-map id="v4map" on-google-map-ready="_mapReady" fit-to-markers api-key="[[apiKey]]">
        <template is="dom-repeat" items="[[towers]]" as="t">
          <google-map-marker slot="markers" click-events latitude="[[t.lat]]" longitude="[[t.lng]]" on-google-map-marker-click="_markerClick" >
          </google-map-marker>
        </template>
        <plastic-map-info id="myinfocard" fade-in>
        <div class="layout horizontal">
          <div>
            <img src$="[[tower.imgUrl]]" style="height: 100px; width: 60px;" />
          </div>
          <div class="layout vertical" style="padding-left: 5px;">
            <div style="font-weight: bold; font-family: 'Roboto', 'Noto', sans-serif; font-size: 11pt; color: maroon;">
              [[tower.tower]]
            </div>
            <div style="font-weight: bold; font-family: 'Roboto', 'Noto', sans-serif; font-size: 9pt;">
              [[tower.description]]
            </div>
            <div style="margin-top: 9px;">
              <paper-button class="redwhite" raised on-tap="nextTower">Next Tower</paper-button>
            </div>
          </div>
        </div>
        <div slot="info-beak">
          <svg width="120" height="80">
            <defs>
              <path id="beaktext" d="M 17,20 L 62,80" />
            </defs>
            <line x1="7.5" y1="10" x2="60" y2="80" style="stroke:rgb(255,0,0);stroke-width:2" />
            <text style="font-size: 9pt; stroke: red;">
              <textPath xlink:href="#beaktext">
                [[tower.tower]]
              </textPath>
            </text>
          </svg>
        </div>
        </plastic-map-info>
      </google-map>
      `),cssMarkup=hljs.highlight("css",`
        plastic-map-info {
            --plastic-map-info-mixin: {
              background-color: transparent;
              border-bottom: solid red;
              color: red;
              padding: 10px 18px 5px 5px;
              border-radius: 2px;
              max-width: 75%;
            }
            ;
          }
    
          paper-button.redwhite {
            background-color: red;
            color: white;
            font-family: 'Roboto', 'Noto', sans-serif;
            cursor: pointer;
          }
      `);this.$.sources.innerHTML=`
      <h2>Radical Styling and a Custom Beek</h2>
      <p>In this example we use style mixins to modify the appearance of the infowindow
      and add a custom SVG beek (the pointer from the window to the marker).</p>
      <h3>CSS</h3>
      <pre><code class="css">${cssMarkup.value}</code></pre>
      <h3>Markup</h3>
      <pre><code class="html">${mapMarkup.value}</code></pre>`;const jsCode=hljs.highlight("javascript",`
        nextTower() {
            let nextTowerIdx = this.tower.idx >= 4 ? 0 : this.tower.idx + 1;
            let nextMarker = this.$.v4map.markers[nextTowerIdx].marker;
            this.$.myinfocard.close();
            nextMarker.map.panTo(nextMarker.getPosition());
            nextMarker.map.setZoom(4);
            this.tower = this.towers[nextTowerIdx];
            this.$.myinfocard.showInfoWindow(nextMarker);
        }
      
        _markerClick(e) {
          this.tower = e.model.get('t');
            this.$.myinfocard.showInfoWindow(e.target.marker);
        }
      `);this.$.sources.innerHTML+=`<h3>Javascript</h3>
      <p>This illustrates handling the on-tap for the next tower button and the marker click event to show the infowindow.</p>
      <pre><code class="javascript">${jsCode.value}</code></pre>`}}window.customElements.define("my-view4",MyView4)});