'use client';

export default function CRMStream() {
  return (
    <div className="w-full h-[800px] border mt-6">
      <iframe
        src="https://partnertech-crm.streamlit.app/?embed=true"
        className="w-full h-full"
        title="Streamlit CRM Metrics"
        frameBorder="0"
      />
    </div>
  );
}
