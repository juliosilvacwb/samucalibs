import React from 'react';
import MultiSelectAria from './lib/components/multi-select-aria/multi-select-aria';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      options: [],
      selecteds: [{label: 'item c', value: 'item 2'}],
      selected: undefined,
      selectedsForInitialValueExample: {label: 'Initial 1', value: 1},
      isLoading: false
    }
  }

  onFilter = (value) => {

    const options = [
      {label: 'item a', value: 'item 1'},
      {label: 'item c', value: 'item 2'},
      {label: 'item d', value: 'item 3'},
      {label: 'item e', value: 'item 4'},
      {label: 'item f', value: 'item 5'},
      {label: 'item g', value: 'item 6'},
      {label: 'item h', value: 'item 7'}
    ]

    if (value) {
      this.setState({...this.state, isLoading: true});
      let optionsFiltered = options.filter((item) => item.label && item.label.toLowerCase().includes(value.toLowerCase()));
      setTimeout(() => {
        this.setState({...this.state, options: optionsFiltered, isLoading: false});
      }, 2000);
    }
  }

  onSingleSelect = (item) => {
    this.setState({...this.state, selected: item});
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
              <h2>Single selected</h2>
              <MultiSelectAria 
                isLoading={this.state.isLoading}
                options={this.state.options}
                onInputChange={(e) => this.onFilter(e)}
                onSelect={(item) => this.onSingleSelect(item)}
                labelKey={'label'}
                valueKey={'value'}
                initialValue={{label: 'item a', value: 'item 1'}}
                multi={false}
                selected={this.state.selected}
              />
              {
                this.state.selected && 
                <div style={{marginTop: '2rem'}}>
                  <strong>Label: </strong>{this.state.selected.label}
                  <strong style={{marginLeft: '1rem'}}>Value: </strong>{this.state.selected.value}
                </div>
              }
            </div>
            <div style={{width: '50%', marginTop: '2rem'}}>
              <h2>Multi selecteds</h2>
              <MultiSelectAria 
                isLoading={this.state.isLoading}
                options={this.state.options}
                onInputChange={(e) => this.onFilter(e)}
                onSelect={(items) => this.onSelect(items)}
                labelKey={'label'}
                valueKey={'value'}
                multi={true}
                selected={this.state.selecteds}
              />
              <div style={{marginTop: '2rem'}}>
              {
                this.state.selecteds.map((item, i)=> (
                    <div key={i} >
                      <strong>Label: </strong>{item.label}
                      <strong style={{marginLeft: '1rem'}}>Value: </strong>{item.value}
                    </div>
                ))
              }
              </div>
            </div>
            <div style={{width: '50%', marginTop: '2rem'}}>
              <h2>Initial value</h2>
              <MultiSelectAria 
                isLoading={this.state.isLoading}
                options={[
                  {label: 'Initial 1', value: 1},
                  {label: 'Initial 2', value: 2},
                  {label: 'Initial 3', value: 3}
                ]}
                onSelect={(selectedsForInitialValueExample) => 
                  this.setState({...this.state, selectedsForInitialValueExample})}
                labelKey={'label'}
                valueKey={'value'}
                statick={true}
                multi={false}
                selected={this.state.selectedsForInitialValueExample}
              />
              <div style={{marginTop: '2rem'}}>
              {
                this.state.selectedsForInitialValueExample &&
                <div>
                  <strong>Label: </strong>{this.state.selectedsForInitialValueExample.label}
                  <strong style={{marginLeft: '1rem'}}>Value: </strong>{this.state.selectedsForInitialValueExample.value}
                </div>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
