import React, { useState } from 'react';
import { Section, Field } from '../ProjectComponents';

export default function SpecificationsTab({ project }) {
  const s = project.specs || {};
  const [gemstonesOpen, setGemstonesOpen] = useState(true);
  const [styleOpen, setStyleOpen] = useState(true);

  return (
    <div className="specifications-tab">
      <Section label="General">
        <div className="fields-wrap">
          <Field label="Jewelry Type" value={s.type} />
          <Field label="Name" value={s.name} />
          <Field label="Description" value={s.description} wide textarea />
        </div>
      </Section>

      <Section label="Dimensions & Sizing">
        <div className="fields-wrap">
          <Field label="Size" value={s.size} />
          <Field label="Band Width" value={s.bandWidth} />
          <Field label="Band Thickness" value={s.bandThickness} />
          <Field label="Total Height" value={s.totalHeight} />
          <Field label="Est. Weight" value={s.weight} />
        </div>
      </Section>

      <Section label="Metal">
        <div className="fields-wrap">
          <Field label="Metal" value={s.metal} />
          <Field label="Karat" value={s.metalKarat} />
          <Field label="Finish" value={s.finish} />
          <Field label="Plating" value={s.plating} />
        </div>
      </Section>

      <Section label="Gemstones" collapsed={!gemstonesOpen} onToggle={() => setGemstonesOpen(!gemstonesOpen)}>
        <div className="fields-wrap">
          <Field label="Main Gemstone" value={s.mainGemstone} />
          <Field label="Shape" value={s.gemstoneShape} />
          <Field label="Setting Type" value={s.settingType} />
          <Field label="Side Stones" value={s.sideStones} />
        </div>
      </Section>

      <Section label="Style Details" collapsed={!styleOpen} onToggle={() => setStyleOpen(!styleOpen)}>
        <div className="fields-wrap">
          <Field label="Band Style" value={s.bandStyle} />
          <Field label="Ring Type" value={s.ringType} />
          <Field label="Design Motif" value={s.designMotif} />
          <Field label="Texture" value={s.texture} />
        </div>
      </Section>
    </div>
  );
}
