import React, { Component } from "react";
import $                    from "jquery";
import Auth                 from "j-toker";
import Tabs                 from "../components/Tabs/Tabs.js";
import UpdateProfile        from "../components/Forms/ProfileUpdateForm.js";
// import ImageUploadModal     from "../components/ImageUploadModal.js";
import Profileimg           from "../images/profile-img.png";
import CalendarAccordion    from "../components/Accordions/CalendarAccordion.js";
import ReviewsAccordion     from "../components/Accordions/UserReviewsAccordion.js";
import Modal                from "../components/Modal/Modal.js";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
                    currentEvents:          [],
                    pastEvents:             [],
                    reviews:                [],
                    profileImageUrl:        "",
                    date:                   null,
                    todaysDate:             new Date(),
                    menuTabs:               ["Upcoming Events", "Past Events", "My Reviews"],
                    activeTabIndex:         0,
                    updateProfileModalOpen: false,
                    imageUploadModalOpen:   false,
                    deleteAcctWindow:       {
                                              "content":  "Are you sure you want to delete your account?",
                                              "title":    "Delete Account",
                                              buttonText: "Yes, delete account"
                                            },
                    showDeleteAccountModal:  false,
                  }
    this.toggleUpdateProfileModal      = this.toggleUpdateProfileModal.bind(this);
    this.toggleImageUploadModal        = this.toggleImageUploadModal.bind(this);
    this.toggleConfirmationWindowModal = this.toggleConfirmationWindowModal.bind(this);
    this.onUpdateAccount               = this.onUpdateAccount.bind(this);
    this.onDeleteAccount               = this.onDeleteAccount.bind(this);
    this.handleTabsClick               = this.handleTabsClick.bind(this);
    this.renderActiveTabContent        = this.renderActiveTabContent.bind(this);
    this.sortCalendar                  = this.sortCalendar.bind(this);
  }

  componentDidMount() {
    let userId = this.props.match.params.id
    // if there is a user id
    if(userId) {
      $.ajaxSetup({
        beforeSend(xhr, settings) {
          Auth.appendAuthHeaders(xhr, settings);
        }
      });
      $.get({
        url: `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
        success: (data) => {
          //let images = data.images //array
          //let avatar = images[images.length - 1].avatar.url
          let sortedCalendar = this.sortCalendar(data.calendars)
          this.setState({
                          currentEvents: sortedCalendar.currentEvents,
                          pastEvents: sortedCalendar.pastEvents,
                          reviews:  data.reviews,
                          //profileImageUrl: avatar, // currently selecting the last image added
                        })
        },
        error: (data) => {
          this.props.history.push("/login")
        }
      });

      let dates = this.getTodaysDates()
      this.setState({
        date: dates.todayForDisplay,
        todaysDate: dates.todaysDate
      })
    } else {
      this.props.history.push("/login")
    }
  }

  getTodaysDates() {
    let today = new Date();
    today.setHours(0,0,0,0) // for comparison with date from db, hours should be set to 0 (otherwise is will categorize today as past event)
    let dd    = today.getDate();
    let mm    = today.getMonth()+1; //January is 0!
    let yyyy  = today.getFullYear();
    if(dd<10) { dd = `0${ dd }`}
    if(mm<10) {mm = `0${ mm }`}
    let todayAsStr = `${ mm }/${ dd }/${ yyyy }`
    let dates = {
      todayForDisplay: todayAsStr,
      todaysDate: today,
    }
    return dates
  }

  sortCalendar(calendar) {
    // separate current + past calendar events
    // sort each set by date
    let pastEvents = []
    let currentEvents = []
    calendar.map(entry => {
      let calendarEntryDate = new Date(entry.date)
      if(calendarEntryDate >= this.state.todaysDate) {
        currentEvents.push(entry)
      } else {
        pastEvents.push(entry)
      }
    })
    this.sortCalendarEntriesByDate(pastEvents)
    return {
      pastEvents: this.sortCalendarEntriesByDate(pastEvents),
      currentEvents: this.sortCalendarEntriesByDate(currentEvents),
    }
  }

  sortCalendarEntriesByDate(entries) {
    let sortedCalendar = entries.sort((day1,day2) => {
                          let selectedDay = new Date(day1.date)
                          let nextDay = new Date(day2.date)
                          return nextDay - selectedDay
                        });
    return sortedCalendar
  }

  toggleUpdateProfileModal() {
    this.setState({ updateProfileModalOpen: !this.state.updateProfileModalOpen });
  }

  toggleImageUploadModal() {
    this.setState({ imageUploadModalOpen: !this.state.imageUploadModalOpen });
  }

  toggleConfirmationWindowModal() {
    this.setState({ showDeleteAccountModal: !this.state.showDeleteAccountModal });
  }

  // onUpdateAccount(newData) {
  //   Auth.updateAccount({
  //     name:   newData.name,
  //     image:  newData.image
  //   })
  // }
  //
  // onDeleteAccount() {
  //   Auth.destroyAccount();
  //   Auth.signOut();
  //   this.props.history.push("/")
  // }

  handleTabsClick(activeTabIdx) {
    this.setState({
      activeTabIndex: activeTabIdx
    })
  }

  renderActiveTabContent() {
    if(this.state.activeTabIndex === 0) {
      return(
        <div>
        {this.state.currentEvents[0] ?
          <CalendarAccordion calendarEvents={ this.state.currentEvents } />
          :
          <p>You have no upcoming calendar entries yet!</p>
        }
      </div>
      )
    } else if (this.state.activeTabIndex === 1) {
        return(
          <div>
          {this.state.pastEvents[0] ?
            <CalendarAccordion calendarEvents={ this.state.pastEvents } />
            :
            <p>You have no past calendar entries!</p>
          }
        </div>
      )
    } else if (this.state.activeTabIndex === 2) {
      return(
        <div>
        {this.state.reviews[0] ?
          <ReviewsAccordion reviews={ this.state.reviews } />
          :
          <p>You have no reviews yet!</p>
        }
      </div>
      )
    }
  }

  render(){
    return(
      <div className="container">
        <div className="row background">
          { this.state.showDeleteAccountModal ?
            <Modal
              content={ this.state.deleteAcctWindow.content }
              title={ this.state.deleteAcctWindow.title }
              buttonText={ this.state.deleteAcctWindow.buttonText }
              close={ this.toggleConfirmationWindowModal }
              submit={ this.onDeleteAccount }
            />
            :
            null
          }
          <div className="col-12">
            <div className="row profile-box">
              {/* { this.state.imageUploadModalOpen ? <ImageUploadModal close={ this.toggleImageUploadModal}  /> : null } */}
              <div className="col-md-4 profile-img">
                {/* <button onClick={ this.toggleImageUploadModal }> */}
                  <img
                    src={ this.state.profileImageUrl ? this.state.profileImageUrl : Profileimg }
                    alt="profile"/>
                {/* </button> */}
              </div>
              { this.state.updateProfileModalOpen ? <UpdateProfile close={ this.toggleUpdateProfileModal}  /> : null }
              <div className="col-md-8">
                {Auth.user.name && <h2>Welcome, { Auth.user.name }!</h2>}
                <p> Today is { this.state.date }</p>
                <button className="icon-btn" onClick={ this.toggleConfirmationWindowModal }>
                  <i className="far fa-trash-alt"></i>
                </button>
                <button className="icon-btn" onClick={ this.toggleUpdateProfileModal }>
                  <i className="far fa-edit"></i>
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Tabs
                  handleTabsClick={ this.handleTabsClick }
                  tabs={ this.state.menuTabs }
                />
                { this.renderActiveTabContent() }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile;
