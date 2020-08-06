import React from 'react';
import MultiSelectAria from './lib/components/multi-select-aria/multi-select-aria';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      list: [
        {label: 'item a', value: 'item 1'},
        {label: 'item c', value: 'item 2'},
        {label: 'item d', value: 'item 3'},
        {label: 'item e', value: 'item 4'},
        {label: 'item f', value: 'item 5'},
        {label: 'item g', value: 'item 6'},
        {label: 'item h', value: 'item 7'}
      ],
      selecteds: [],
      isLoading: false
    }
  }

  onFilter = (value) => {
    if (value) {
      this.setState({...this.state, isLoading: true});
      let list = this.state.list.filter((item) => item.label && item.label.toLowerCase().includes(value.toLowerCase()));
      this.setState({...this.state, list});
      setTimeout(() => {
        this.setState({...this.state, isLoading: false});
      }, 2000);
    }
  }

  onSelect = (items) => {
    this.setState({...this.state, selecteds: items});
  }

  render(){

    return (
      <div className="App">
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{width: '800px'}}>
            <h1>Samuca Lib's</h1>
            <div style={{width: '50%'}}>
              <MultiSelectAria 
                isLoading={this.state.isLoading}
                list={this.state.list}
                selecteds={this.state.selecteds}
                onInputChange={(e) => this.onFilter(e)}
                onSelect={(items) => this.onSelect(items)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
