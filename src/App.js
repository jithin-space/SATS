import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import logo from './logo.svg';

import { Table } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

import './App.css';


class Entry extends Component{
  render(){
    let data=this.props.data;


    return(
      <tr>
        <td>{this.props.person}</td>
        <td>{data[0]}</td>
        <td>{data[1]}</td>
        <td>{data[2]}</td>
        <td>{data[3]}</td>
        <td>{data.filter((e)=> e !== false).length+'/'+'4'}</td>
      </tr>
    );
  }
}

class SearchBar extends Component{
  constructor(props){
    super(props);
     this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date){
    this.props.onDateChange(date);
  }
  render(){
    return(

      <div className="row form-group text-center">
        <fieldset className="scheduler-border">
          <legend className="scheduler-border"> Date: </legend>
          <DatePicker className="form-control text-center"
            selected={this.props.date}
            onChange={this.handleChange}
            dateFormat='DD/MM/YYYY'
          />
        </fieldset>
      </div>

    );

  }
}

class DataDailyTable extends Component{
  render(){
    const results=this.props.data;
    let row={};
    let rows=[];
    let lastPerson=null;

    results.forEach((attendance)=>{
      if(attendance.marked_by !== lastPerson){
        lastPerson = attendance.marked_by;
        row[lastPerson]=[false,false,false,false];

      }
      switch(attendance.slot){
        case 'slot1':
            row[lastPerson][0]= attendance.s_name;
            break;
        case 'slot2':
            row[lastPerson][1]= attendance.s_name;
            break;
        case 'slot3':
            row[lastPerson][2]= attendance.s_name;
            break;
        case 'slot4':
            row[lastPerson][3]= attendance.s_name;
            break;
        default:
          break;
      }
    });




    Object.keys(row).forEach((key)=> {
      rows.push(<Entry person={key} data={row[key]} />);
    });



   return(
     <tbody>{rows}</tbody>
   );


  }
}

class AttendanceTable extends Component{

  render(){
    const results=[];
    this.props.data.forEach((attendance)=>
         {
           if(moment(attendance.created_at).format('DD/MM/YYYY') === (this.props.date.format('DD/MM/YYYY'))){
             results.push(attendance)

           };
         });

    return(
      <Table  striped bordered condensed hover responsive>
        <thead>
          <tr className="warning">
            <th>Resource Person </th>
            <th>Slot1</th>
            <th>Slot2</th>
            <th>Slot3</th>
            <th>Slot4</th>
            <th>Total</th>
          </tr>

        </thead>

          <DataDailyTable data={results} />

      </Table>
    );

  }
}

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      startDate: moment(),
      attendances: []
    }
    this.handleDateChange=this.handleDateChange.bind(this);
  }

  componentDidMount(){
     fetch('http://192.168.1.190/api/attendance')
     .then(results=>{
       return results.json();
     }).then(data => this.setState({ attendances: data }));
  }

  handleDateChange(date){
    this.setState({
      startDate:date
    });
  }
  render(){
    return(
      <div className="container">
        <SearchBar date={this.state.startDate} onDateChange={this.handleDateChange}/>
        <AttendanceTable data={this.state.attendances} date={this.state.startDate}/>
      </div>
    );
  }
}

export default App;
