import React, { useState, useEffect } from "react";
import { 
  Modal, 
  IconButton, 
  Text, 
  Spinner, 
  SpinnerSize
} from "@fluentui/react";
import { recordModalStyles } from "../../styles";

// Simplified interface for the props
interface RecordModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  recordId?: string;
  entityType?: string;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onDismiss,
  recordId,
  entityType
}) => {
  const [loading, setLoading] = useState(true);
  const [formUrl, setFormUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get form URL when modal opens
  useEffect(() => {
    if (isOpen && recordId && entityType) {
      try {
        const clientUrl = `${window.location.protocol}//${window.location.host}`;
        const url = getEntityFormUrl(clientUrl, entityType, recordId);
        console.log("Form URL:", url);
        setFormUrl(url);
      } catch (err) {
        console.error("Error getting form URL:", err);
        setError(`Could not create form URL: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      setFormUrl(null);
    }
  }, [isOpen, recordId, entityType]);

  // Helper function to construct entity form URL
  const getEntityFormUrl = (clientUrl: string, logicalName: string, id: string): string => {
    const url = window.location.href;
    const appId = new URL(url).searchParams.get("appid");
    
    return (
      clientUrl +
      "/main.aspx?" +
      "appid=" +
      appId +
      "&pagetype=entityrecord" +
      "&etn=" + logicalName +
      "&id=" + id +
      "&viewtype=1039" +
      "&navbar=off"
    );
  };

  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      isBlocking={false}
      containerClassName={recordModalStyles.container as string}
      styles={{ 
        main: { 
          minWidth: '80vw',
          maxWidth: '90vw'
        } 
      }}
    >
      {/* Gradient border */}
      <div style={recordModalStyles.gradientBorder} />
      
      {/* Header */}
      <div style={recordModalStyles.header}>
        <Text style={recordModalStyles.headerText}>
          {"Opportunity"}
        </Text>
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel="Close"
          onClick={onDismiss}
          style={recordModalStyles.closeButton}
        />
      </div>
      
      {/* Content - Just the iframe */}
      <div style={recordModalStyles.content}>
        {loading && (
          <div style={recordModalStyles.spinnerContainer}>
            <Spinner size={SpinnerSize.large} label="Loading record..." />
          </div>
        )}
        
        {error ? (
          <div style={recordModalStyles.errorContainer}>
            <Text style={recordModalStyles.errorText}>{error}</Text>
          </div>
        ) : formUrl ? (
          <div style={recordModalStyles.iframeContainer}>
            <iframe 
              src={formUrl}
              style={recordModalStyles.iframe}
              onLoad={handleIframeLoad}
              title="Dataverse Record Form"
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
