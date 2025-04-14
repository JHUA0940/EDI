export const validateEDIMessage = (message) => {
  if (!message.trim()) return 'EDI message cannot be empty';

  const lines = message.trim().split('\n');
  const hasLIN = lines.some(line => line.startsWith('LIN+'));
  const hasPAC = lines.some(line => line.startsWith('PAC+'));

  if (!hasLIN || !hasPAC) {
    return 'Missing required segments: LIN or PAC';
  }

  for (let line of lines) {
    if (!line.trim()) continue;

    // Must end with a single quote
    if (!line.endsWith("'")) {
      return "Each segment must end with a single quote (')";
    }

    // Must include +
    if (!line.includes('+')) {
      return 'Each segment must contain "+" as data element separator';
    }

    // Disallow square brackets
    if (/[[\]]/.test(line)) {
      return 'Square brackets [ or ] are not allowed in EDI message';
    }
  }

  // Check LIN segment numbering
  const linSegments = lines.filter(line => line.startsWith('LIN+'));
  for (let i = 0; i < linSegments.length; i++) {
    const expected = (i + 1).toString();
    const actual = linSegments[i].split('+')[1];
    if (actual !== expected) {
      return `LIN segment sequence error: Expected ${expected}, but found ${actual}`;
    }
  }

  return '';
};
