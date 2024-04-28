
/**
 * Gets the max points the user can possibly have achieved.
 * @param {object} studentScores the student's scores in the class.
 * @param {object} maxScores the max scores for assignments in the class.
 * @returns {number} the max points the user could have gotten so far.
 */
export function getMaxPointsSoFar(studentScores, maxScores) {
    return Object.keys(studentScores).reduce((acc, assignment) => {
        Object.values(maxScores[assignment]).forEach((catTotal) => {
            acc += +(catTotal ?? 0);
        }, 0);
        return acc;
    }, 0);
}
