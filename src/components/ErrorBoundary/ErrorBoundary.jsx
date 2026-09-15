import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { cn } from 'cn';
import Button from '@components/Button/Button';
import Row from '@components/Row/Row';
import styles from './ErrorBoundary.module.scss';

// Shows a message instead of a blank screen when rendering below it throws.
// A new resetKey (for example the URL) clears the error without remounting the children.
// React already reports caught errors to console.error.
class ErrorBoundary extends Component {
    state = { error: null, resetKey: this.props.resetKey };

    static getDerivedStateFromError(error) {
        return { error };
    }

    static getDerivedStateFromProps(props, state) {
        return props.resetKey === state.resetKey ? null : { error: null, resetKey: props.resetKey };
    }

    reset = () => this.setState({ error: null });

    render() {
        if (!this.state.error) return this.props.children;

        return (
            <div role="alert" className={cn(styles.errorBoundary, this.props.className)}>
                <h2 className={styles.title}>
                    <FormattedMessage id="common.errorTitle" />
                </h2>
                <p><FormattedMessage id="common.errorMessage" /></p>

                <Row justify="center">
                    <Button variation="secondary" onClick={this.reset}>
                        <FormattedMessage id="common.tryAgain" />
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                        <FormattedMessage id="common.reloadPage" />
                    </Button>
                </Row>
            </div>
        );
    }
}

export default ErrorBoundary;
