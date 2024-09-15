import React, { Component } from 'react'
import NewsItem from './NewsItem'
import InfiniteScroll from 'react-infinite-scroll-component'

export default class Home extends Component {
    constructor(){
        super()
        this.state = {
            articles : [],
            totalResults :0,
            page:1
        }
    }
    getInputData = async ()=>{
      var response = ""
       try {
        if(this.props.search)
         response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=1&q=${this.props.search}&language=${this.props.language}&pageSize=20&apiKey=15ec9a36d4ae40b888e28267e60eb787`)
       else
         response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=1&q=${this.props.q}&language=${this.props.language}&pageSize=20&apiKey=15ec9a36d4ae40b888e28267e60eb787`)
        response = await response.json()
        this.setState({
            articles:response.articles,
            totalResults:response.totalResults
        })
       } catch (error) {
            alert("Somthing Went Wrong !!!")
       }
    }
    fetchMoreData = async () =>{
      this.setState({page:this.state.page+1})
      var response = ""
      try {
        if(this.props.search)
         response = await fetch(`https://newsapi.org/v2/everything?page=${this.state.page}&q=${this.props.search}&language=${this.props.language}&pageSize=20&apiKey=15ec9a36d4ae40b888e28267e60eb787`)
       else
         response = await fetch(`https://newsapi.org/v2/everything?page=${this.state.page}&q=${this.props.q}&language=${this.props.language}&pageSize=20&apiKey=15ec9a36d4ae40b888e28267e60eb787`)
        response = await response.json()
        this.setState({
            articles: this.state.articles.concat(response.articles)
        })
       } catch (error) {
            // alert("Somthing Went Wrong !!!")
       }
    }
    
    componentDidMount(){
        this.getInputData()
    }
    componentDidUpdate(old){
      if(this.props!==old)
      this.getInputData()
    }
  render() {
    return (
      <div className='container-fluid'>
        <h5 className='background p-2 text-center text-light mt-1'>{this.props.search?this.props.search:this.props.q} News</h5>
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length<this.state.totalResults}
          loader={
           <div className=' my-5 text-center'>
              <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
           </div>
          }
        >
        <div className="row">
            {
                this.state.articles.map((item,index)=>{
                    return <NewsItem 
                    key={index}
                    title = {item.title.slice(0,80)+"..."}
                    description = {item.description}
                    pic = {item.urlToImage}
                    url = {item.url}
                    source = {item.source.name}
                    date = {item.publishedAt}
                    />
                   
                })
            }
      </div>
      </InfiniteScroll>
      </div>
    )
  }
}
