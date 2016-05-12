class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: []
    }
  }
  submitUrl(url) {
    const that = this;
    $.post(window.location.origin+'/sites', {url: url}, function(response) {
      let updatedUrlList = that.state.urls.concat({'url': url, 'jobId': response.jobId});
      that.setState({urls: updatedUrlList});
    })
  }

  render() {
    return (
      <div>
        <h1>Rochelle's Massdrop Coding Challenge</h1>
        <SubmitUrlForm
          handleUrlSubmit={this.submitUrl.bind(this)} />
        <JobStatusForm />
        <UrlList urls={this.state.urls} />
      </div>

    );
  }
}

class UrlList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const urls = this.props.urls;
    const urlEntries = urls.map((url)=>
      <UrlEntry key={url.jobId} url={url}/>
    );

    return (
      <div className="url-list-container">
        <h2>Your Jobs</h2>
        {urlEntries}
      </div>
    );
  }
}

class UrlEntry extends React.Component {
  render() {
    const urlData = this.props.url;
    return (
       <div className="url-entry">
        <div className="url-entry-column">
          <div className="url-label">URL: </div> <div className='url-details'> {urlData.url} </div>
        </div>
        <div className="url-entry-column">
          <div className="job-label">Job Id: </div> <div className='url-details'> {urlData.jobId} </div>
        </div>
      </div>
    );
  }
}

class SubmitUrlForm extends React.Component {
  constructor(props) {
    super(props);
    this.state= {url: ''};
  }

  handleChange(event) {
    this.setState({url: event.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleUrlSubmit(this.state.url);
    this.setState({url:''});
  }

  render() {
    return (
      <div className="url-form-container">
        <form className="url-form" onSubmit={this.handleSubmit.bind(this)}>
          <input className="input-holder" type="text" placeholder="Enter URL" onChange={this.handleChange.bind(this)} value={this.state.url}/>
        </form>
      </div>
    )
  }
}

class JobStatusForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state= {
      jobId: '',
      pendingJobId: '',
      status: null,
    };
  }

  handleChange(event) {
    this.setState({jobId: event.target.value});
  }

  handleSubmit(e) {
    var that = this;
    e.preventDefault();
    $.ajax({
      url: window.location.origin+'/site/'+this.state.jobId,
      success: function(response) {
        window.location = window.location.origin+'/html'
        that.setState({jobId:'', pendingJobId: null, status: null})
      },
      error: function(err){
        that.setState({
          status: 'Pending',
          pendingJobId: that.state.jobId,
          jobId: ''
        });
      }
    });
  }

  render() {
    return (
      <div className="job-status">
        <form className="url-form" onSubmit={this.handleSubmit.bind(this)}>
          <input className="input-holder" type="text" placeholder="Enter job ID to check status" onChange={this.handleChange.bind(this)} value={this.state.jobId}/>
        </form>
        { this.state.status ? <div className="status-container">Status of Job #{this.state.pendingJobId} - Pending </div> : null }
      </div>
    )
  }

}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
