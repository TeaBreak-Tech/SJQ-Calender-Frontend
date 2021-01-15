import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as data from './event.json'

// Cannot set constructor ??
class DayCell extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state={
  //     event:null
  //   }
  // }

  // componentDidMount() {
  //   if (data.start_time.year===this.props.year
  //     && data.start_time.day_of_month===this.props.day
  //     && data.start_time.month===this.props.month+1)
  //     {      
  //       this.setState({event: data})
  //     }
  // }
  hanldClick() {
    if (data.start_time.year === this.props.year
      && data.start_time.day_of_month === this.props.day
      && data.start_time.month === this.props.month + 1) {
      alert(data.event_name)
    }
  }


  // use for lebal
  format(month) {
    month++; // month start with 0;
    if (month<10) {
      return "0"+month;
    }
    return ""+month
  }
  render() {

    return (
      <td class="day_cell" topLeftCornerDate topRightCornerDate bottomLeftCornerDate bottomRightCornerDate dayOutsideNavigatedMonth>
        <botton class="day_bottom" label={"" + this.props.year + this.format(this.props.month) + this.format(this.props.day-1)} aria-selected="false" data-is-focusable="true" aria-disabled="false" type="button" role="gridcell" onClick={() => { this.hanldClick() }}>
          <span aria-hidden="true">{this.props.day}</span>
        </botton>
      </td>
    )
  }
}



function WeekRow(props) {

  return (
    <tr class="week_row">

      {
        props.days_row.map((element) => {
          return <DayCell day={element.day} year={element.year} month={element.month} />
        })
      }

    </tr>
  )
}

class SearchBox extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        value: 'year_month', 
        month: 0, 
        year: 0, 
        week_of_month: 1,
        id: 0
      };
      this.handleChange = this.handleChange.bind(this);
      this.getEventByMonth=this.getEventByMonth.bind(this)
      this.getEventByWeek = this.getEventByWeek.bind(this)
      this.getEventByID = this.getEventByID.bind(this)
  }
  handleChange(event) {
      this.setState({value: event.target.value});
  }

  searchID(id) {
    /**TO-DO */
  }
  getEventByID(event) {
    this.setState({id: event.target.value})
  }

  searchMonth(year, month) {
    /* To-Do */    
    console.log(year, month)
  }
  getEventByMonth(event) {
    var [year, month] = event.target.value.split('-')
    if (month[0] === ("0")) {month=month[1]}
    this.setState({
      year: year,
      month: month
    })   
  }


  searchWeek(year, month, week) {
    /* To-Do */    
    console.log(year, month, week)
  }
  getEventByWeek(event) {
    this.setState({
      week_of_month: event.target.value
    })
  }

  box(value){

    if (value==="event_id") {
      return (
        <div>
          <input type="id" placeholder="ID" onChange={this.getEventByMonth} >
            {this.searchID}
          </input>
        </div>
      )
    }

    else if (value==="year_month") {
      return (
        <div>
          <input type="month" placeholder="月" onChange={this.getEventByMonth}>{this.searchMonth(this.state.year, this.state.month)}</input>
        </div>
      )
    }

    else if (value==="year_month_week") {
      function options_week() {     
        var options = [];
        for (let w=1; w<7; w++) {
          options.push(<option value={w}>{w}</option>);
        }
        return options;      
      }
      return (
        <div>
          <input type="month" placeholder="月" onChange={this.getEventByMonth}></input>
          <div>
            <label>第
                <select value={this.state.week_of_month} onChange={this.getEventByWeek}>
                    {options_week()}
                    {this.searchWeek(this.state.year, this.state.month, this.state.week_of_month)}
                </select> 周
            </label>
          </div>
          
        </div>  
      )
  }
}
  render() {
      return (
              <div class="searchBox">
                  <label>Search by：
                      <select value={this.state.value} onChange={this.handleChange}>
                          <option value="event_id">ID</option>
                          <option value="year_month">月</option>
                          <option value="year_month_week">周</option>
                      </select>
                  </label>
                  {this.box(this.state.value)}
                  
              </div>

      )
  }
}


const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: null,
      year: null,
      curDate: new Date(),
      showlist: Array(42).fill(0),
    }
  }

  componentDidMount() {
    this.setCurrentYearMonth()
  }
  setCurrentYearMonth() {
    var month = this.state.curDate.getUTCMonth()
    var year = this.state.curDate.getUTCFullYear()

    var monthDays = this.getCurrentDaysPerMonth(year, month)

    var weekDay = this.getWeeksByFirstDay(year, month)

    var curday = 1
    const showlist = this.state.showlist.slice()
    for (let i = weekDay; i < weekDay + monthDays; i++) {
      // showlist[i] = curday
      showlist[i] = { year: year, month: month, day: curday }
      curday++;

    }
    this.setState({
      showlist: showlist,
      month: month,
      year: year,
      events: data
    })
  }

  getCurrentDaysPerMonth(year, month) {
    // leap year
    if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
      if (month == 1) // 2nd month 
        return 29;
    }
    return MONTH_DAYS[month]
  }

  getWeeksByFirstDay(year, month) {
    var date = this.getDateByYearMonth(year, month)
    return date.getDay()
  }

  getDayText(line, weekIndex, weekDay, monthDays) {
    var number = line * 7 + weekIndex - weekDay + 1
    if (number <= 0 || number > monthDays) {
      return <span>&nbsp;</span>
    }

    return number
  }

  getDateByYearMonth(year, month, day = 1) {
    var date = new Date()
    date.setFullYear(year)
    date.setMonth(month, day)
    return date
  }

  checkToday(line, weekIndex, weekDay, monthDays) {
    var { year, month } = this.state
    var day = Calendar.getDayText(line, weekIndex, weekDay, monthDays)
    var date = new Date()
    var todayYear = date.getFullYear()
    var todayMonth = date.getMonth()
    var todayDay = date.getDate()

    return year === todayYear && month === todayMonth && day === todayDay
  }

  monthChange(monthChanged) {
    var { month, year } = this.state
    var monthAfter = month + monthChanged
    var date = this.getDateByYearMonth(year, monthAfter)
    this.setCurrentYearMonth(date)
  }

  weekTable() {

    var week_table_ = []
    for (let i = 0; i < 42; i += 7) {
      week_table_.push(<WeekRow days_row={this.state.showlist.slice(i, i + 7)} />)
    }
    return week_table_
  }
  render() {

    return (
      <div class="main">
        
        <div class="topnav">
          <a class="active" href="#home">TeaBreak</a>
          <a href="#about">Calendar</a>
          <a href="#contact">More</a>
        </div>

        <div class="table1"> 
          <div>
          <table class="month_view_table"> 
          <tbody> 
            <tr> 
            <th class="weekDayLabelCell" scope="col" title="星期日" aria-label="星期日">日</th> 
            <th class="weekDayLabelCell" scope="col" title="星期一" aria-label="星期一">一</th> 
            <th class="weekDayLabelCell" scope="col" title="星期二" aria-label="星期二">二</th> 
            <th class="weekDayLabelCell" scope="col" title="星期三" aria-label="星期三">三</th> 
            <th class="weekDayLabelCell" scope="col" title="星期四" aria-label="星期四">四</th> 
            <th class="weekDayLabelCell" scope="col" title="星期五" aria-label="星期五">五</th> 
            <th class="weekDayLabelCell" scope="col" title="星期六" aria-label="星期六">六</th> 
            </tr> 
            {this.weekTable()} 
          </tbody> 
          </table>
          </div>


          <div class="_1vLrNwYDjbwCu_3Ozq5hn5" role="complementary" aria-label=""> 
          <SearchBox />
          <div class="_1ly3FD3IgkwRfF0Tle6YHf" title="1 月 14 日 周四">
            {this.state.curDate.toLocaleDateString()}
          </div> 
          <div class="events"> 
            {/**TO-DO */}
            <table title="Event">EVENTS
              <li>{data.event_name}</li>
              <li>{data.event_name}</li>
              <li>{data.event_name}</li>
              <li>{data.event_name}</li>
              <li>{data.event_name}</li>
              <li>{data.event_name}</li>
              <li>{data.event_name}</li>
              <li>{data.event_name}</li>
              <li>{data.event_name}</li>
            </table>
            {/* <div class="Event">{data.event_name}</div>  */}
          </div> 
        </div>  
        </div> 
        
        
        </div> 
    )
    //   return (<div>
    //     <table className="whole_table">
    //       <caption>
    //         <div className="caption-header">
    //           <span className="arrow" onClick={()=>this.monthChange(-1)}>&#60;</span>
    //           <span>{year}年 {Calendar.formatNumber(month)} 月</span>
    //           <span className="arrow" onClick={()=>this.monthChange(1)}>&gt;</span>
    //         </div>
    //       </caption>
    //       <thead>
    //         <tr className="week_header">
    //           {
    //             WEEK_NAMES.map((week, key) => {
    //               return <td key={key}>{week}</td>
    //             })
    //           }
    //         </tr>
    //       </thead>
    //       <tbody className="table">
    //       {
    //         LINES.map((l, key) => {
    //           return <tr key={key}>
    //             {
    //               WEEK_NAMES.map((week, index) => {
    //                 return <td key={index} onClick={()=>alert("click")}  style={{color: this.checkToday(key, index, weekDay, monthDays) ? 'red' : '#000'}}>
    //                   {Calendar.getDayText(key, index, weekDay, monthDays)}
    //                 </td>
    //               })
    //             }
    //           </tr>
    //         })
    //       }
    //       </tbody>
    //     </table>
    //   </div>)
    // }
  }
}

export default Calendar;
