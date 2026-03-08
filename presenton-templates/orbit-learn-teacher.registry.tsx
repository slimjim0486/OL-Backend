import {
  TemplateGroupSettings,
  TemplateWithData,
  createTemplateEntry,
} from "./utils";

import TitleSlide, {
  Schema as TitleSlideSchema,
  layoutDescription as TitleSlideDescription,
  layoutId as TitleSlideId,
  layoutName as TitleSlideName,
} from "../../presentation-templates/orbit-learn-teacher/1-TitleSlide";
import LearningObjectivesSlide, {
  Schema as LearningObjectivesSchema,
  layoutDescription as LearningObjectivesDescription,
  layoutId as LearningObjectivesId,
  layoutName as LearningObjectivesName,
} from "../../presentation-templates/orbit-learn-teacher/2-LearningObjectivesSlide";
import ContentSlide, {
  Schema as ContentSlideSchema,
  layoutDescription as ContentSlideDescription,
  layoutId as ContentSlideId,
  layoutName as ContentSlideName,
} from "../../presentation-templates/orbit-learn-teacher/3-ContentSlide";
import KeyConceptSlide, {
  Schema as KeyConceptSlideSchema,
  layoutDescription as KeyConceptSlideDescription,
  layoutId as KeyConceptSlideId,
  layoutName as KeyConceptSlideName,
} from "../../presentation-templates/orbit-learn-teacher/4-KeyConceptSlide";
import SummarySlide, {
  Schema as SummarySlideSchema,
  layoutDescription as SummarySlideDescription,
  layoutId as SummarySlideId,
  layoutName as SummarySlideName,
} from "../../presentation-templates/orbit-learn-teacher/5-SummarySlide";

import orbitLearnTeacherSettings from "../../presentation-templates/orbit-learn-teacher/settings.json";

export const orbitLearnTeacherTemplates: TemplateWithData[] = [
  createTemplateEntry(
    TitleSlide,
    TitleSlideSchema,
    TitleSlideId,
    TitleSlideName,
    TitleSlideDescription,
    "orbit-learn-teacher",
    "1-TitleSlide"
  ),
  createTemplateEntry(
    LearningObjectivesSlide,
    LearningObjectivesSchema,
    LearningObjectivesId,
    LearningObjectivesName,
    LearningObjectivesDescription,
    "orbit-learn-teacher",
    "2-LearningObjectivesSlide"
  ),
  createTemplateEntry(
    ContentSlide,
    ContentSlideSchema,
    ContentSlideId,
    ContentSlideName,
    ContentSlideDescription,
    "orbit-learn-teacher",
    "3-ContentSlide"
  ),
  createTemplateEntry(
    KeyConceptSlide,
    KeyConceptSlideSchema,
    KeyConceptSlideId,
    KeyConceptSlideName,
    KeyConceptSlideDescription,
    "orbit-learn-teacher",
    "4-KeyConceptSlide"
  ),
  createTemplateEntry(
    SummarySlide,
    SummarySlideSchema,
    SummarySlideId,
    SummarySlideName,
    SummarySlideDescription,
    "orbit-learn-teacher",
    "5-SummarySlide"
  ),
];

export const orbitLearnTeacherTemplateSettings =
  orbitLearnTeacherSettings as TemplateGroupSettings;
