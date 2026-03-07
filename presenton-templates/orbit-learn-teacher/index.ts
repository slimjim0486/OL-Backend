// Orbit Learn Teacher Template Group Index
// Exports all slide layouts for Presenton to discover

import TitleSlide from './1-TitleSlide';
import LearningObjectivesSlide from './2-LearningObjectivesSlide';
import ContentSlide from './3-ContentSlide';
import KeyConceptSlide from './4-KeyConceptSlide';
import SummarySlide from './5-SummarySlide';

import * as TitleSlideModule from './1-TitleSlide';
import * as LearningObjectivesSlideModule from './2-LearningObjectivesSlide';
import * as ContentSlideModule from './3-ContentSlide';
import * as KeyConceptSlideModule from './4-KeyConceptSlide';
import * as SummarySlideModule from './5-SummarySlide';

export {
  TitleSlide,
  LearningObjectivesSlide,
  ContentSlide,
  KeyConceptSlide,
  SummarySlide,
};

export const layouts = [
  {
    id: TitleSlideModule.layoutId,
    name: TitleSlideModule.layoutName,
    description: TitleSlideModule.layoutDescription,
    schema: TitleSlideModule.Schema,
    component: TitleSlide,
  },
  {
    id: LearningObjectivesSlideModule.layoutId,
    name: LearningObjectivesSlideModule.layoutName,
    description: LearningObjectivesSlideModule.layoutDescription,
    schema: LearningObjectivesSlideModule.Schema,
    component: LearningObjectivesSlide,
  },
  {
    id: ContentSlideModule.layoutId,
    name: ContentSlideModule.layoutName,
    description: ContentSlideModule.layoutDescription,
    schema: ContentSlideModule.Schema,
    component: ContentSlide,
  },
  {
    id: KeyConceptSlideModule.layoutId,
    name: KeyConceptSlideModule.layoutName,
    description: KeyConceptSlideModule.layoutDescription,
    schema: KeyConceptSlideModule.Schema,
    component: KeyConceptSlide,
  },
  {
    id: SummarySlideModule.layoutId,
    name: SummarySlideModule.layoutName,
    description: SummarySlideModule.layoutDescription,
    schema: SummarySlideModule.Schema,
    component: SummarySlide,
  },
];

export const layoutCount = layouts.length;

export default layouts;
