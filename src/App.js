import React from 'react';
import './App.css';
import text from './pkdx.json'
import 'semantic-ui-css/semantic.min.css'
import {Table, Grid, Segment, Header, Transition, Image, Icon, Modal, Menu, Input} from 'semantic-ui-react'

class App extends React.Component{
	constructor(props)
	{
		super(props)
		var list = []
		var maxhp = 0
		var maxatk = 0
		var maxdef = 0
		var maxsatk = 0
		var maxsdef = 0
		var maxspe = 0
		text.forEach((pkm) =>
		{
			pkm.forme.forEach((forme) =>
			{
				if(forme.id !== '1170' && forme.id !== '213')
				{
					if(maxhp < parseInt(forme.hp))
						maxhp = parseInt(forme.hp)
					if(maxatk < parseInt(forme.atk))
						maxatk = parseInt(forme.atk)
					if(maxdef < parseInt(forme.def))
						maxdef = parseInt(forme.def)
					if(maxsatk < parseInt(forme.satk))
						maxsatk = parseInt(forme.satk)
					if(maxsdef < parseInt(forme.sdef))
						maxsdef = parseInt(forme.sdef)
					if(maxspe < parseInt(forme.spe))
						maxspe = parseInt(forme.spe)
				}
				if(forme.abilities.primary === forme.abilities.secondary)
					forme.abilities.secondary = null
				if(forme.abilities.primary === forme.abilities.hidden)
					forme.abilities.hidden = null
				list.push(
					{
						id: pkm.id,
						galarId: pkm.galarId,
						name: pkm.name,
						types: forme.types,
						hp: forme.hp,
						atk: forme.atk,
						def: forme.def,
						satk: forme.satk,
						sdef: forme.sdef,
						spe: forme.spe,
						total: parseInt(forme.hp) + parseInt(forme.atk) + parseInt(forme.def) + parseInt(forme.satk) + parseInt(forme.sdef) + parseInt(forme.spe),
						image: 'icon/' + forme.id + '.png',
						inbattle: 'inbattle/' + forme.id + '.png',
						shiny: 'inbattle/' + forme.id + '-s.png',
						abilities: forme.abilities,
						levelUpMoves: forme.levelUpMoves,
						eggMoves: forme.eggMoves,
						tmMoves: forme.tmMoves,
						trMoves: forme.trMoves
					})
			})
		})
		list = list.sort((a, b) =>
		{
			return parseInt(a.id) - parseInt(b.id)
		})
		this.state = 
		{
			linebreaks: '',
			translated: list,
			full: list,
			column: null,
			direction: null,
			hpc: 100/maxhp,
			atkc: 100/maxatk,
			defc: 100/maxdef,
			satkc: 100/maxsatk,
			sdefc: 100/maxsdef,
			spec: 100/maxspe,
			filter : '',
			showDex: false,
			selected: null
		}
    	this._handleChange = this._handleChange.bind(this)
		this._translate = this._translate.bind(this)
		this._sort = this._sort.bind(this)
		this._filter = this._filter.bind(this)
		this._showEntry = this._showEntry.bind(this)
		this._close = this._close.bind(this)
		this.handleItemClick = this.handleItemClick.bind(this)
	}
	handleItemClick(e)
	{

	}
	_showEntry(pkm)
	{
		this.setState({ showDex: true, selected: pkm })
	}
	_close()
	{
		this.setState({ showDex: false, selected: null })
	}
	_handleChange(event) {
		this.setState({linebreaks: event.target.value})
	}
	_translate()
	{
		var lines = this.state.linebreaks.split("\n")
		var dex = []
		for(var i = 1 ; i < lines.length ; i++)
		{
			//search for Base Stats
			var stats = ''
			var j = 0
			while(stats === '' && lines[i + j] !== '')
			{
				if(lines[i + j].includes('Base Stats'))
				{
					stats = lines[i + j].split(": ")[1].split(" (")[0].split('.')
					break;
				}
				j++
			}
			j = 0
			var types = []
			while(types.length === 0 && lines[i + j] !== '')
			{
				if(lines[i + j].includes('Type'))
				{
					types = lines[i + j].split(": ")[1].split(" / ")
					break;
				}
				j++
			}
			j = 0
			var levelUpMoves = []
			while(levelUpMoves.length === 0 && lines[i + j] !== '')
			{
				if(lines[i + j].includes('Level Up Moves'))
				{
					j++
					while(lines[i + j].includes('- '))
					{
						var move = 
						{
							level: lines[i + j].substring(lines[i + j].indexOf('[') + 1, lines[i + j].indexOf(']')),
							move: lines[i + j].substring(lines[i + j].indexOf(']') + 2)
						}
						levelUpMoves.push(move)
						j++
					}
				}
				j++
			}
			j = 0
			var eggMoves = []
			while(eggMoves.length === 0 && lines[i + j] !== '')
			{
				if(lines[i + j].includes('Egg Moves'))
				{
					j++
					while(lines[i + j].includes('- '))
					{
						var move =
						{
							move: lines[i + j].substring(lines[i + j].indexOf(' ') + 1)
						}
						eggMoves.push(move)
						j++
					}
				}
				j++
			}
			j = 0
			var tmMoves = []
			while(tmMoves.length === 0 && lines[i + j] !== '')
			{
				if(lines[i + j].includes('TMs'))
				{
					j++
					while(lines[i + j].includes('- '))
					{
						var move = 
						{
							tm: lines[i + j].substring(lines[i + j].indexOf('[') + 1, lines[i + j].indexOf(']')),
							move: lines[i + j].substring(lines[i + j].indexOf(']') + 2)
						}
						tmMoves.push(move)
						j++
					}
				}
				j++
			}
			j = 0
			var trMoves = []
			while(trMoves.length === 0 && lines[i + j] !== '')
			{
				if(lines[i + j].includes('TRs'))
				{
					j++
					while(lines.length !== (i + j) && lines[i + j].includes('- '))
					{
						var move = 
						{
							tr: lines[i + j].substring(lines[i + j].indexOf('[') + 1, lines[i + j].indexOf(']')),
							move: lines[i + j].substring(lines[i + j].indexOf(']') + 2)
						}
						trMoves.push(move)
						j++
					}
				}
				j++
			}
			j = 0
			var abilities = 
			{
				primary: null,
				secondary: null,
				hidden: null
			}
			while(lines[i + j])
			{
				if(lines[i + j].includes('Abilities'))
				{
					var rawAbilities = lines[i+ j].substring(lines[i + j].indexOf(':') + 1).split('|')
					for(var x = 0 ; x < rawAbilities.length ; x++)
					{
						rawAbilities[x] = rawAbilities[x].trim();
						if(rawAbilities[x].includes('(1)'))
						{
							abilities.primary = rawAbilities[x].replace(' (1)', '')
						}
						if(rawAbilities[x].includes('(2)'))
						{
							abilities.secondary = rawAbilities[x].replace(' (2)', '')
						}
						if(rawAbilities[x].includes('(H)'))
						{
							abilities.hidden = rawAbilities[x].replace(' (H)', '')
						}
					}
					break;
				}
				j++
			}
			var name = lines[i].substring(lines[i].indexOf(' ', lines[i].indexOf(' ') + 1), lines[i].indexOf('(') - 1) 
			var numbers = /[A-z]* [0-9]/;
			if(name.match(numbers))
			{
				name = name.substring(0, name.lastIndexOf(' '))
			}
			if(dex.filter(pkm => (pkm.name === name)).length === 0)
			{
				var pokemon = 
				{
					id : lines[i].split(' ')[0],
					galarId: lines[i + 2].split(": ")[1],
					name: name,
					forme: [
					{
						id: lines[i].split(' ')[0],
						forme: lines[i].substring(6, lines[i].indexOf('(')),
						types: types,
						hp: stats[0],
						atk: stats[1],
						def: stats[2],
						satk: stats[3],
						sdef: stats[4],
						spe: stats[5],
						abilities: abilities,
						levelUpMoves: levelUpMoves,
						eggMoves: eggMoves,
						tmMoves: tmMoves,
						trMoves: trMoves
					}]
				}
				dex.push(pokemon)
			}
			else
			{
				pokemon = dex.filter(pkm => (pkm.name === name))[0]
				var forme = 
					{
						id: lines[i].split(' ')[0],
						forme: lines[i].substring(6, lines[i].indexOf('(')),
						types: types,
						hp: stats[0],
						atk: stats[1],
						def: stats[2],
						satk: stats[3],
						sdef: stats[4],
						spe: stats[5],
						abilities: abilities,
						levelUpMoves: levelUpMoves,
						eggMoves: eggMoves,
						tmMoves: tmMoves,
						trMoves: trMoves
					}
				pokemon.forme.push(forme)
			}
			i+=2
			while(i < lines.length && lines[i] !== '======')
				i++
		}
		console.log(JSON.stringify(dex))
	}
	_sort(clickedColumn)
	{
		if(this.state.column !== clickedColumn)
		{
			var dex = this.state.translated
			dex = dex.sort((a,b)=>
			{
				switch(clickedColumn)
				{
					case 'id':
						return parseInt(b.id) - parseInt(a.id)
					case 'idGalar':
						var agalarId = a.galarId.substring(1)
						var bgalarId = b.galarId.substring(1)
						if(a.galarId === 'Foreign')
							agalarId = 800 + parseInt(a.id)
						if(b.galarId === 'Foreign')
							bgalarId = 800 + parseInt(b.id)
						return parseInt(bgalarId) - parseInt(agalarId)
					case 'name':
						return (b.name < a.name) ? -1 : (b.name > a.name) ? 1 : 0
					case 't1':
						return (b.types[0] < a.types[0]) ? -1 : (b.types[0] > a.types[0]) ? 1 : 0
					case 't2':
						return (b.types[1] < a.types[1]) ? -1 : (b.types[1] > a.types[1]) ? 1 : 0
					case 'total':
						return b.total - a.total
					case 'hp':
						return parseInt(b.hp) - parseInt(a.hp)
					case 'atk':
						return parseInt(b.atk) - parseInt(a.atk)
					case 'def':
						return parseInt(b.def) - parseInt(a.def)
					case 'satk':
						return parseInt(b.satk) - parseInt(a.satk)
					case 'sdef':
						return parseInt(b.sdef) - parseInt(a.sdef)
					case 'spe':
						return parseInt(b.spe) - parseInt(a.spe)
					default:
						return parseInt(b.id) - parseInt(a.id)
				}
			})
			this.setState(
				{
					column: clickedColumn,
					direction: 'descending',
					translated: dex,
					full: dex
				}
			)
		}
		else
		{
			var dex = this.state.translated.reverse()
			this.setState({
				translated: dex,
				full: dex,
				direction: this.state.direction === 'descending' ? 'ascending' : 'descending'
			})
		}
	}
	/*
	
		<textarea onChange={this._handleChange}></textarea>
		<button onClick={this._translate}>Translate</button>
	 */
	_filter(event)
	{
		this.setState({ filter: event.target.value })
		var dex = this.state.full
		dex = dex.filter((pkm) => pkm.name.toLowerCase().includes(event.target.value.toLowerCase()))
		this.setState({translated: dex})
	}
	/*
				<Menu fixed='top' inverted>
					<Menu.Item
					name='pokedex'
					active={true}
					onClick={this.handleItemClick}
					>
					Pokedex
					</Menu.Item>

					<Menu.Item
					name='abilitydex'
					onClick={this.handleItemClick}
					>
					Abilitydex
					</Menu.Item>

					<Menu.Item
					name='movedex'
					onClick={this.handleItemClick}
					>
					Movedex
					</Menu.Item>
				</Menu> */
	render() {
    	const { column, direction } = this.state
		return (
			<div className="App">
				<Menu fixed='top' inverted>
        			<Menu.Item header>FoxDex</Menu.Item>
					<Menu.Item
					name='pokedex'
					active={true}
					onClick={this.handleItemClick}
					>
					Pokedex
					</Menu.Item>

					<Menu.Item
					name='abilitydex'
					onClick={this.handleItemClick}
					>
					Abilitydex
					</Menu.Item>

					<Menu.Item
					name='movedex'
					onClick={this.handleItemClick}
					>
					Movedex
					</Menu.Item>
				</Menu> 
				<Grid>
					<Grid.Row>
						<Grid.Column width='sixteen'>
							<Segment basic>
								<Input inverted placeholder='Search...' value={this.state.searchString} onChange={this._filter}/>
							</Segment>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={this.state.showDex ? 8 : 16}>
							<Segment basic>
								<Transition animation='glow' visible={!this.state.showDex}>
									<Table inverted unstackable sortable celled selectable>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell sorted={column === 'id' ? direction: null} onClick={() => this._sort('id')}>#</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 'idGalar' ? direction: null} onClick={() => this._sort('idGalar')}># Galar</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 'name' ? direction: null} onClick={() => this._sort('name')}>Name</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 't1' ? direction: null} onClick={() => this._sort('t1')}>Type 1</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 't2' ? direction: null} onClick={() => this._sort('t2')}>Type 2</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 'total' ? direction: null} onClick={() => this._sort('total')}>Total</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 'hp' ? direction: null} onClick={() => this._sort('hp')}>HP</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 'atk' ? direction: null} onClick={() => this._sort('atk')}>Atk</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 'def' ? direction: null} onClick={() => this._sort('def')}>Def</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 'satk' ? direction: null} onClick={() => this._sort('satk')}>SAtk</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 'sdef' ? direction: null} onClick={() => this._sort('sdef')}>SDef</Table.HeaderCell>
												<Table.HeaderCell sorted={column === 'spe' ? direction: null} onClick={() => this._sort('spe')}>Spe</Table.HeaderCell>
												<Table.HeaderCell></Table.HeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{this.state.translated.map((i, index) =>
												<Table.Row key={index} onClick={() => this._showEntry(i)}>
													<Table.Cell>{i.id}</Table.Cell>
													<Table.Cell>{i.galarId}</Table.Cell>
													<Table.Cell>{i.name}</Table.Cell>
													<Table.Cell>{i.types[0]}</Table.Cell>
													<Table.Cell>{i.types[1] ?? ''}</Table.Cell>
													<Table.Cell>{i.total}</Table.Cell>
													<Table.Cell 
														positive={this.state.hpc * i.hp >= 66}
														warning={this.state.hpc * i.hp > 33 && this.state.hpc * i.hp < 66}
														negative={this.state.hpc * i.hp <= 33}>{i.hp}
													</Table.Cell>
													<Table.Cell
														positive={this.state.atkc * i.atk >= 66}
														warning={this.state.atkc * i.atk > 33 && this.state.atkc * i.atk < 66}
														negative={this.state.atkc * i.atk <= 33}>{i.atk}
													</Table.Cell>
													<Table.Cell
														positive={this.state.defc * i.def >= 66}
														warning={this.state.defc * i.def > 33 && this.state.defc * i.def < 66}
														negative={this.state.defc * i.def <= 33}>{i.def}
													</Table.Cell>
													<Table.Cell
														positive={this.state.satkc * i.satk >= 66}
														warning={this.state.satkc * i.satk > 33 && this.state.satkc * i.satk < 66}
														negative={this.state.satkc * i.satk <= 33}>{i.satk}
													</Table.Cell>
													<Table.Cell
														positive={this.state.sdefc * i.sdef >= 66}
														warning={this.state.sdefc * i.sdef > 33 && this.state.sdefc * i.sdef < 66}
														negative={this.state.sdefc * i.sdef <= 33}>{i.sdef}
													</Table.Cell>
													<Table.Cell
														positive={this.state.spec * i.spe >= 66}
														warning={this.state.spec * i.spe > 33 && this.state.spec * i.spe < 66}
														negative={this.state.spec * i.spe <= 33}>{i.spe}
													</Table.Cell>
													<Table.Cell>
														<img src={i.image} />
													</Table.Cell>
												</Table.Row>
											)}
										</Table.Body>
									</Table>
								</Transition>
							</Segment>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<Modal basic open={this.state.showDex} dimmer='blurring'>
					<Segment inverted basic>
						<Grid columns={4}>
								<Grid.Row>
									<Grid.Column width={16} textAlign='right'>
										<Segment basic padded>
											<Icon inverted size='big' onClick={this._close} name='close'></Icon>
										</Segment>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={16} textAlign='center'>
										<Header inverted as='h1'>{this.state.selected?.name}</Header>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={8} textAlign='center'>
										<Header inverted as='h4'>Regular</Header>
										<Image size='small' centered src={this.state.selected?.inbattle} />
									</Grid.Column>
									<Grid.Column width={8} textAlign='center'>
										<Header inverted as='h4'>Shiny</Header>
										<Image size='small' centered src={this.state.selected?.shiny} />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row centered>
									<Grid.Column width={13} textAlign='center'>
										<Table celled inverted textAlign='center'>
											<Table.Header>
												<Table.Row>
													{this.state.selected?.abilities?.primary && 
														<Table.HeaderCell>
															Primary Ability
														</Table.HeaderCell>
													}
													{this.state.selected?.abilities?.secondary && 
														<Table.HeaderCell>
															Secondary Ability
														</Table.HeaderCell>
													}
													{this.state.selected?.abilities?.hidden && 
														<Table.HeaderCell>
															Hidden Ability
														</Table.HeaderCell>
													}
												</Table.Row>
												<Table.Row>
													{this.state.selected?.abilities?.primary && 
														<Table.Cell>
															{this.state.selected?.abilities?.primary}
														</Table.Cell>
													}
													{this.state.selected?.abilities?.secondary && 
														<Table.Cell>
															{this.state.selected?.abilities?.secondary}
														</Table.Cell>
													}
													{this.state.selected?.abilities?.hidden && 
														<Table.Cell>
															{this.state.selected?.abilities?.hidden}
														</Table.Cell>
													}
												</Table.Row>
											</Table.Header>
										</Table>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row centered>
									<Grid.Column width={13} textAlign='center'>
										<Table celled inverted textAlign='center'>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>
														Total
													</Table.HeaderCell>
													<Table.HeaderCell>
														HP
													</Table.HeaderCell>
													<Table.HeaderCell>
														Attack
													</Table.HeaderCell>
													<Table.HeaderCell>
														Defense
													</Table.HeaderCell>
													<Table.HeaderCell>
														Special Attack
													</Table.HeaderCell>
													<Table.HeaderCell>
														Special Defense
													</Table.HeaderCell>
													<Table.HeaderCell>
														Speed
													</Table.HeaderCell>
												</Table.Row>
												<Table.Row>
													<Table.Cell>
														
													</Table.Cell>
													<Table.Cell 
														positive={this.state.hpc * this.state.selected?.hp >= 66}
														warning={this.state.hpc * this.state.selected?.hp > 33 && this.state.hpc * this.state.selected?.hp < 66}
														negative={this.state.hpc * this.state.selected?.hp <= 33}>{this.state.selected?.hp}
													</Table.Cell>
													<Table.Cell
														positive={this.state.atkc * this.state.selected?.atk >= 66}
														warning={this.state.atkc * this.state.selected?.atk > 33 && this.state.atkc * this.state.selected?.atk < 66}
														negative={this.state.atkc * this.state.selected?.atk <= 33}>{this.state.selected?.atk}
													</Table.Cell>
													<Table.Cell
														positive={this.state.defc * this.state.selected?.def >= 66}
														warning={this.state.defc * this.state.selected?.def > 33 && this.state.defc * this.state.selected?.def < 66}
														negative={this.state.defc * this.state.selected?.def <= 33}>{this.state.selected?.def}
													</Table.Cell>
													<Table.Cell
														positive={this.state.satkc * this.state.selected?.satk >= 66}
														warning={this.state.satkc * this.state.selected?.satk > 33 && this.state.satkc * this.state.selected?.satk < 66}
														negative={this.state.satkc * this.state.selected?.satk <= 33}>{this.state.selected?.satk}
													</Table.Cell>
													<Table.Cell
														positive={this.state.sdefc * this.state.selected?.sdef >= 66}
														warning={this.state.sdefc * this.state.selected?.sdef > 33 && this.state.sdefc * this.state.selected?.sdef < 66}
														negative={this.state.sdefc * this.state.selected?.sdef <= 33}>{this.state.selected?.sdef}
													</Table.Cell>
													<Table.Cell
														positive={this.state.spec * this.state.selected?.spe >= 66}
														warning={this.state.spec * this.state.selected?.spe > 33 && this.state.spec * this.state.selected?.spe < 66}
														negative={this.state.spec * this.state.selected?.spe <= 33}>{this.state.selected?.spe}
													</Table.Cell>
												</Table.Row>
											</Table.Header>
										</Table>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>
										<Table inverted>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>
														Level
													</Table.HeaderCell>
													<Table.HeaderCell>
														Move
													</Table.HeaderCell>
												</Table.Row>
											</Table.Header>
											<Table.Body>
												{
													this.state.selected?.levelUpMoves.map((i, index)=>
														(
															<Table.Row key={index}>
																<Table.Cell>
																	{i.level}
																</Table.Cell>
																<Table.Cell>
																	{i.move}
																</Table.Cell>
															</Table.Row>
														)
													)
												}
											</Table.Body>
										</Table>
									</Grid.Column>
									<Grid.Column>
										<Table inverted>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>
														Egg Moves
													</Table.HeaderCell>
												</Table.Row>
											</Table.Header>
											<Table.Body>
												{
													this.state.selected?.eggMoves.map((i, index)=>
														(
															<Table.Row key={index}>
																<Table.Cell>
																	{i.move}
																</Table.Cell>
															</Table.Row>
														)
													)
												}
											</Table.Body>
										</Table>
									</Grid.Column>
									<Grid.Column>
									{
										<Table inverted>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>
														TM
													</Table.HeaderCell>
													<Table.HeaderCell>
														Move
													</Table.HeaderCell>
												</Table.Row>
											</Table.Header>
											<Table.Body>
												{
													this.state.selected?.tmMoves.map((i, index)=>
														(
															<Table.Row key={index}>
																<Table.Cell>
																	{i.tm}
																</Table.Cell>
																<Table.Cell>
																	{i.move}
																</Table.Cell>
															</Table.Row>
														)
													)
												}
											</Table.Body>
										</Table>
									}
									</Grid.Column>
									<Grid.Column>
									{
										<Table inverted>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>
														TR
													</Table.HeaderCell>
													<Table.HeaderCell>
														Move
													</Table.HeaderCell>
												</Table.Row>
											</Table.Header>
											<Table.Body>
												{
													this.state.selected?.trMoves.map((i, index)=>
														(
															<Table.Row key={index}>
																<Table.Cell>
																	{i.tr}
																</Table.Cell>
																<Table.Cell>
																	{i.move}
																</Table.Cell>
															</Table.Row>
														)
													)
												}
											</Table.Body>
										</Table>
									}
									</Grid.Column>
								</Grid.Row>
							</Grid>
					</Segment>
				</Modal>
			</div>
		)
	}
}
export default App;
