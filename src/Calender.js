import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment'
import 'fullcalendar';
import 'fullcalendar-scheduler';

class Calender extends Component {

  constructor (props){
    super(props);
    this.state = {
      users: [],
      events: []
    };
    this._selectCallBack = this._selectCallBack.bind(this);
  }

  componentDidMount(){

    let currentComponent = this;

    let userData = fetch("/users.json")
    .then(response => response.json());

    let eventData = fetch("/event.json")
    .then(response => response.json());

    Promise.all([userData,eventData]).then(function(values){

      let users = [], events = [];
      let task = "green", meeting="orange";

       values[0].result.map(obj1 => {
          let user = {};
          user.id = obj1.user_id;
          user.title = obj1.name;
          users.push(user);
       });

        values[1].result.map(obj2 => {
          let event = {};
          event.id = obj2.event_id;
          event.end =  moment(obj2.end_date_time, 'YYYYMMDDTHHmmss').format('YYYY-MM-DDTHH:mm:ss');
          event.start =  moment(obj2.start_date_time,'YYYYMMDDTHHmmss').format('YYYY-MM-DDTHH:mm:ss');
          event.title = obj2.name;
          event.type = obj2.type;

          users.map(user => {
            if(user.id === obj2.user){
              event.resourceId = obj2.user;
            if(obj2.type === "task"){
              user.eventColor = task;
            }
            else if(obj2.type === "meeting"){
              user.eventColor = meeting;
          }
            }
          });

          events.push(event);
       });


      currentComponent.setState({users: users, events: events});
    });

  }

  _selectCallBack(start, end, jsEvent, view, resource){
    let event = {};

    event.start = moment(start,'YYYY-MM-DDTHH:mm:ss');
    event.end = moment(end,'YYYY-MM-DDTHH:mm:ss');
    event.resourceId = resource.id;
    event.type = "task";
    event.title = "Custom Added Task";
    
    this.state.events.push(event);

    $('#calendar').fullCalendar('destroy');
    this._loadFullCalender();

  }

  _loadFullCalender(){
    $('#calendar').fullCalendar({
      now: '2018-05-08',
      selectable: true,
      selectConstraint : "businessHours",
      height: 400,
      defaultView: 'timelineDay',
      resourceLabelText: 'Resources',
      resources: this.state.users,
      events: this.state.events,
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      businessHours: true,
      eventOverlap: false,
      select : this._selectCallBack
  })
  }

  render() {
    return (
      <div>
      <div id='calendar'></div>
        {this._loadFullCalender()}
      </div>
      );
  }
}

export default Calender;
