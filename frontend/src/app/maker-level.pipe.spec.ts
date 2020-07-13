import { MakerLevelPipe } from './maker-level.pipe';

describe('MakerLevelPipe', () => {
  it('should create an instance', () => {
    const pipe = new MakerLevelPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the string for the level of the tea maker', () => {
    const pipe = new MakerLevelPipe();
    expect(pipe.transform(1)).toEqual('Junior');
    expect(pipe.transform(2)).toEqual('Mid');
    expect(pipe.transform(3)).toEqual('Senior');
  })
});
