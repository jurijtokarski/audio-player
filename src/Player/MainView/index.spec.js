import React from 'react';
import { shallow } from 'enzyme';
import { expect, spy } from 'chai';

import MainView from './index';

const item1 = {
  title: 'Tarantelle, Op. 43',
  author: 'Frédéric Chopin',
  background: '/images/1.jpg',
  track: '/tracks/chopin-tarantelle-op43.mp3',
};

const item2 = {
  title: "Andantino 'Spring', B. 117",
  author: 'Frédéric Chopin',
  background: '/images/2.jpg',
  track: '/tracks/chopin-spring.mp3',
};

describe('MainView component', () => {
  const onOpenPlaylistButtonClickMock = spy();
  const onStartPrevItemButtonClickMock = spy();
  const onStartNextItemButtonClickMock = spy();
  const onPlayPauseButtonClickMock = spy();

  const TimerMock = () => (<div />);

  const props = {
    title: item1.title,
    author: item1.author,
    instance: {
      currentTime: 0,
    },
    onOpenPlaylistButtonClick: onOpenPlaylistButtonClickMock,
    onStartPrevItemButtonClick: onStartPrevItemButtonClickMock,
    onStartNextItemButtonClick: onStartNextItemButtonClickMock,
    onPlayPauseButtonClick: onPlayPauseButtonClickMock,
  };

  const stylesMock = {
    title: 'title',
    author: 'author',
    currentTime: 'current-time',
    btnOpenPlaylist: 'open-playlist',
    btnStartPrevItem: 'start-prev',
    btnStartNextItem: 'start-next',
    btnPlayPause: 'play-pause',
  };

  before(() => {
    MainView.__Rewire__('styles', stylesMock);
    MainView.__Rewire__('Timer', TimerMock);
  });

  after(() => {
    MainView.__ResetDependency__('styles');
    MainView.__ResetDependency__('Timer');
  });

  it('renders item author and title ', () => {
    const component = shallow(<MainView {...props} />);

    expect(component.find('.title').text()).to.equal(item1.title);
    expect(component.find('.author').text()).to.equal(item1.author);

    component.setProps({
      title: item2.title,
      author: item2.author,
    });

    expect(component.find('.title').text()).to.equal(item2.title);
    expect(component.find('.author').text()).to.equal(item2.author);

    component.unmount();
  });

  it('renders open playlist button', () => {
    const component = shallow(<MainView {...props} />);
    const button = component.find('button.open-playlist');

    expect(button).to.have.length(1);
    expect(button.prop('onClick')).to.equal(onOpenPlaylistButtonClickMock);

    component.unmount();
  });

  it('renders prev item button', () => {
    const component = shallow(<MainView {...props} />);
    const button = component.find('button.start-prev');

    expect(button).to.have.length(1);
    expect(button.prop('onClick')).to.equal(onStartPrevItemButtonClickMock);

    component.unmount();
  });

  it('renders next item button', () => {
    const component = shallow(<MainView {...props} />);
    const button = component.find('button.start-next');

    expect(button).to.have.length(1);
    expect(button.prop('onClick')).to.equal(onStartNextItemButtonClickMock);

    component.unmount();
  });

  it('renders play/pause button', () => {
    const component = shallow(<MainView {...props} />);
    const button = component.find('button.play-pause');

    expect(button).to.have.length(1);
    expect(button.prop('onClick')).to.equal(onPlayPauseButtonClickMock);

    component.unmount();
  });

  it('renders Timer component', () => {
    const component = shallow(<MainView {...props} />);
    const timer = component.find(TimerMock);

    expect(timer).to.have.length(1);
    expect(timer.prop('instance')).to.equal(props.instance);

    component.unmount();
  });
});
